package gr.helix.lab.web.controller.action;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.model.RestResponse;
import gr.helix.lab.web.domain.CourseEntity;
import gr.helix.lab.web.domain.CourseStudentEntity;
import gr.helix.lab.web.model.course.Course;
import gr.helix.lab.web.model.course.CourseCopyFileRequest;
import gr.helix.lab.web.model.course.CourseErrorCode;
import gr.helix.lab.web.repository.CourseRepository;
import gr.helix.lab.web.repository.CourseStudentRepository;

@RestController
@Secured({"ROLE_STANDARD_STUDENT"})
@RequestMapping(produces = "application/json")
public class CourseStudentController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(HubController.class);

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseStudentRepository courseStudentRepository;

    /**
     * Get all courses, the authenticated student is registered to
     *
     * @return a list of {@link Course} objects
     */
    @GetMapping(value = "/action/user/courses")
    public RestResponse<?> findAll() {
        final List<Course> courses = this.courseRepository.findByStudentEmail(this.currentUserName())
            .stream()
            .map(CourseEntity::toDto)
            .collect(Collectors.toList());

        return RestResponse.result(courses);
    }

    /**
     * Delete a course registration for the authenticated student
     *
     * @param id the registration id
     *
     * @return
     */
    @DeleteMapping(value = "/action/user/course/{id}")
    public RestResponse<?> removeCourse(@PathVariable int id) {
        final CourseStudentEntity registration =
            this.courseStudentRepository.findByStudentEmailAndCourseId(this.currentUserName(), id).orElse(null);

        // Check if registration exists and is not already deleted
        if (registration == null) {
            return RestResponse.error(CourseErrorCode.REGISTRATION_NOT_FOUND, "The course registration has not been found");
        }

        // Check if the authenticated user is also the owner of the course registration
        if (!registration.getWhiteListEntry().getEmail().equals(this.currentUserName())) {
            logger.error("Student [{}] has attempted to delete course registration [{}].", this.currentUserName(), id);

            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course registration has not been found");
        }

        this.courseStudentRepository.deleteById(registration.getId());

        return RestResponse.success();
    }

    /**
     * Copy course files to student file system
     *
     * @param id the course id
     * @param request
     * @return
     */
    @PostMapping(value = "/action/user/course/{id}/file-copy")
    public RestResponse<?> copyCourseFiles(@PathVariable int id, @RequestBody CourseCopyFileRequest request) {
        final CourseStudentEntity registration =
            this.courseStudentRepository.findByStudentEmailAndCourseId(this.currentUserName(), id).orElse(null);

        // Check if course exists and is not already deleted
        if (registration == null || registration.getCourse().isDeleted()) {
            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course has not been found");
        }

        final CourseEntity course = registration.getCourse();

        // Resolve course file paths
        if (course.getFiles().size() == 0) {
            return RestResponse.result(0);
        }

        // Currently only a single path per course is supported
        final String sourceRelative = course.getFiles().get(0).getPath();
        final Path sourceAbsolute = this.fileNamingStrategy.resolvePath(course.getProfessor().getEmail(), sourceRelative);
        final File sourceFile = sourceAbsolute.toFile();

        if(!sourceFile.exists()) {
            logger.warn("Path [{}] for course [{}] was not found", sourceAbsolute.toString(), id);

            return RestResponse.error(CourseErrorCode.PATH_NOT_FOUND, "Course files could not be found");
        }

        // Check target path
        final Path targetRelative = Paths.get(request.getTarget());
        if(targetRelative.isAbsolute()) {
            return RestResponse.error(CourseErrorCode.RELATIVE_PATH_REQUIRED, "A relative path is required");
        }

        final Path targetAbsolute = this.fileNamingStrategy.resolvePath(this.currentUserName(), targetRelative);
        final File targetFile = targetAbsolute.toFile();

        if (targetFile.exists()) {
            if (targetFile.isDirectory()) {
                if (targetFile.list().length != 0) {
                    return RestResponse.error(CourseErrorCode.PATH_NOT_EMPTY, "Folder is not empty");
                }
            } else {
                return RestResponse.error(CourseErrorCode.PATH_EXISTS, "A file with the same name already exists");
            }
        }

        if (sourceAbsolute.equals(targetAbsolute)) {
            return RestResponse.error(
                CourseErrorCode.PATH_TARGET_EQUAL_TO_SOURCE,
                "Target directory is the same with the source directory"
            );
        }

        // 1. Copy files
        // 2. Update last copy operation date for the selected registration
        // 3. Update database record
        // 4. Count copied filed and folders
        try {
            if (sourceFile.isDirectory()) {
                FileUtils.copyDirectory(sourceFile, targetFile);
            } else if (targetFile.isDirectory()) {
                FileUtils.copyFileToDirectory(sourceFile, targetFile);
            } else {
                FileUtils.copyFile(sourceFile, targetFile);
            }

            registration.setLastFileCopyOn(ZonedDateTime.now());

            final long count = sourceFile.isDirectory() ? Files.walk(sourceAbsolute).filter(f -> !f.toFile().isDirectory()).count() : 1;

            return RestResponse.result(count);
        } catch (final IOException ex) {
            return RestResponse.error(CourseErrorCode.IO_ERROR, "Failed to copy files");
        }
    }

}
