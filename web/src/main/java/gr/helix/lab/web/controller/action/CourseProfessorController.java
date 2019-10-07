package gr.helix.lab.web.controller.action;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.ConstraintViolation;
import javax.validation.Valid;
import javax.validation.Validator;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.model.RestResponse;
import gr.helix.core.common.repository.AccountRepository;
import gr.helix.lab.web.domain.CourseEntity;
import gr.helix.lab.web.domain.CourseFileEntity;
import gr.helix.lab.web.domain.CourseStudentEntity;
import gr.helix.lab.web.domain.WhiteListEntryEntity;
import gr.helix.lab.web.model.course.Course;
import gr.helix.lab.web.model.course.CourseErrorCode;
import gr.helix.lab.web.model.course.CourseRegistrationRequest;
import gr.helix.lab.web.model.course.CourseStudent;
import gr.helix.lab.web.model.course.CourseStudentFileRow;
import gr.helix.lab.web.model.course.CourseStudentImportResult;
import gr.helix.lab.web.repository.CourseRepository;
import gr.helix.lab.web.repository.CourseStudentRepository;
import gr.helix.lab.web.repository.WhiteListRepository;

@RestController
@Secured({"ROLE_STANDARD_ACADEMIC", "ROLE_BETA_ACADEMIC"})
@RequestMapping(produces = "application/json")
public class CourseProfessorController extends BaseController {

    private static final Logger     logger = LoggerFactory.getLogger(HubController.class);

    @Autowired
    private Path                    tempDataDirectory;

    @Autowired
    protected Validator             validator;

    @Autowired
    private AccountRepository       accountRepository;

    @Autowired
    private CourseRepository        courseRepository;

    @Autowired
    private CourseStudentRepository courseStudentRepository;

    @Autowired
    private WhiteListRepository     whiteListRepository;

    /**
     * Get all courses for the authenticated professor
     *
     * @return a list of {@link Course} objects
     */
    @GetMapping(value = "/action/courses")
    public RestResponse<?> findCourses() {
        final List<Course> courses = this.courseRepository.findByProfessorId(this.currentUserId())
            .stream()
            .map(CourseEntity::toDto)
            .collect(Collectors.toList());

        return RestResponse.result(courses);
    }

    /**
     * Create a new course for the authenticated professor
     *
     * @param course the course details
     * @return the instance {@link Course} instance
     */
    @PostMapping(value = "/action/course")
    public RestResponse<?> addCourse(@RequestBody Course course) {
        final Optional<AccountEntity> professor = this.accountRepository.findById(this.currentUserId());

        final CourseEntity entity = new CourseEntity();

        entity.merge(course);
        entity.setDeleted(false);
        entity.setProfessor(professor.get());

        // Currently only a single file is supported
        if(!course.getFiles().isEmpty()) {
            final CourseFileEntity file = new CourseFileEntity();

            file.setCourse(entity);
            file.setPath(course.getFiles().get(0));

            entity.getFiles().add(file);
        }

        this.courseRepository.saveAndFlush(entity);

        return RestResponse.result(entity.toDto());
    }

    /**
     * Update an existing course of the authenticated user
     *
     * @param id the course id
     * @param course the course details
     * @return the updated {@link Course} instance
     */
    @PostMapping(value = "/action/course/{id}")
    public RestResponse<?> updateCourse(@PathVariable int id, @RequestBody Course course) {
        final Optional<CourseEntity> entity = this.courseRepository.findById(id);

        // Check if course exists and is not already deleted
        if (!entity.isPresent() || entity.get().isDeleted()) {
            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course has not been found");
        }

        // Check if the authenticated user is also the owner of the course
        if (entity.get().getProfessor().getId() != this.currentUserId()) {
            logger.error("User [{}] has attempted to update course [{}].", this.currentUserName(), course.getId());

            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course has not been found");
        }

        entity.get().merge(course);
        entity.get().setDeleted(false);
        entity.get().setUpdatedOn(ZonedDateTime.now());

        // Currently only a single file is supported
        if (course.getFiles() == null || course.getFiles().isEmpty()) {
            // Remove existing files
            entity.get().getFiles().clear();
        } else {
            if (entity.get().getFiles().isEmpty()) {
                // Add new file
                final CourseFileEntity file = new CourseFileEntity();

                file.setCourse(entity.get());
                file.setPath(course.getFiles().get(0));

                entity.get().getFiles().add(file);
            } else {
                // Update existing file
                entity.get().getFiles().get(0).setPath(course.getFiles().get(0));
            }
        }

        this.courseRepository.saveAndFlush(entity.get());

        return RestResponse.result(entity.get().toDto());
    }

    /**
     * Delete an existing course of the authenticated professor. The course is
     * not deleted from the table. Instead the boolean field deleted is set to
     * true.
     *
     * @param id the course id
     */
    @DeleteMapping(value = "/action/course/{id}")
    public RestResponse<?> removeCourse(@PathVariable int id) {
        final Optional<CourseEntity> course = this.courseRepository.findById(id);

        // Check if course exists and is not already deleted
        if (!course.isPresent() || course.get().isDeleted()) {
            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course has not been found");
        }

        // Check if the authenticated user is also the owner of the course
        if (course.get().getProfessor().getId() != this.currentUserId()) {
            logger.error("User [{}] has attempted to delete course [{}].", this.currentUserName(), id);

            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course has not been found");
        }

        // Mark course as deleted
        course.get().setDeleted(true);

        this.courseRepository.save(course.get());

        return RestResponse.success();
    }

    /**
     * Get all students of a course for the authenticated professor
     *
     * @param id the course id
     * @return a list of {@link CourseStudent} objects
     */
    @GetMapping(value = "/action/course/{id}/registrations")
    public RestResponse<?> findStudents(@PathVariable int id) {
        // Check if course exists and it is not deleted
        final Optional<CourseEntity> course = this.courseRepository.findById(id);

        if (!course.isPresent() || course.get().isDeleted()) {
            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course has not been found");
        }

        // Check if the authenticated user is also the owner of the course
        if (course.get().getProfessor().getId() != this.currentUserId()) {
            logger.error("User [{}] has attempted to access students of course [{}].", this.currentUserName(), id);
            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course has not been found");
        }

        // Get all students
        final List<CourseStudent> students = this.courseStudentRepository.findAllByCourseId(id)
            .stream()
            .map(CourseStudentEntity::toDto)
            .collect(Collectors.toList());

        return RestResponse.result(students);
    }

    /**
     * Add a student registration to a course
     *
     * @param courseId the course id
     * @param request the registration details
     *
     * @return the instance {@link CourseStudent} instance
     */
    @PostMapping(value = "/action/course/{courseId}/registration")
    public RestResponse<?> addStudentToCourse(
        @PathVariable int courseId,
        @RequestBody @Valid CourseRegistrationRequest request,
        BindingResult results
    ) {
        // Validate request data
        if (results.hasErrors()) {
            return RestResponse.invalid(results.getFieldErrors());
        }

        // Check if course exists and it is not deleted
        final Optional<CourseEntity> course = this.courseRepository.findById(courseId);

        if (!course.isPresent() || course.get().isDeleted()) {
            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course has not been found");
        }

        // Check if the authenticated user is also the owner of the course
        if (course.get().getProfessor().getId() != this.currentUserId()) {
            logger.error(
                "User [{}] has attempted to register student [{}] to course [{}].",
                this.currentUserName(), request.getEmail(), courseId
            );

            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course has not been found");
        }

        // Registration email and course must be unique
        CourseStudentEntity registration =
                this.courseStudentRepository.findByStudentEmailAndCourseId(request.getEmail(), courseId).orElse(null);
        if (registration != null) {
            return RestResponse.error(CourseErrorCode.REGISTRATION_ALREADY_EXISTS, "A registration already exists");
        }

        // Create white list entry if one does not already exist
        registration = this.addStudentToCourse(
            course.get(), request.getEmail(), request.getFirstName(), request.getLastName()
        );

        return RestResponse.result(registration.toDto());
    }

    /**
     * Update an existing student registration to a course
     *
     * @param courseId the course id
     * @param registrationId the registration id
     * @param request the registration details
     * @return the instance {@link CourseStudent} instance
     */
    @PostMapping(value = "/action/course/{courseId}/registration/{registrationId}")
    public RestResponse<?> updateCourseStudent(
        @PathVariable int courseId,
        @PathVariable int registrationId,
        @RequestBody @Valid CourseRegistrationRequest request,
        BindingResult results
    ) {
        // Validate request data
        if (results.hasErrors()) {
            return RestResponse.invalid(results.getFieldErrors());
        }

        // Check if course exists and it is not deleted
        final Optional<CourseEntity> course = this.courseRepository.findById(courseId);

        if (!course.isPresent() || course.get().isDeleted()) {
            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course has not been found");
        }

        // Check if the authenticated user is also the owner of the course
        if (course.get().getProfessor().getId() != this.currentUserId()) {
            logger.error(
                "User [{}] has attempted to register student [{}] to course [{}].",
                this.currentUserName(), request.getEmail(), courseId
            );

            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course has not been found");
        }

        // Check if registration exists
        final Optional<CourseStudentEntity> registration = this.courseStudentRepository.findById(registrationId);

        if(!registration.isPresent()) {
            return RestResponse.error(CourseErrorCode.REGISTRATION_NOT_FOUND, "The student registartion has not been found");
        }

        registration.get().getWhiteListEntry().setFirstName(request.getFirstName());
        registration.get().getWhiteListEntry().setLastName(request.getLastName());

        return RestResponse.result(registration.get().toDto());
    }

    /**
     * Remove a student registration from a course
     *
     * @param courseId the course id
     * @param registrationId the registration id
     */
    @DeleteMapping(value = "/action/course/{courseId}/registration/{registrationId}")
    public RestResponse<?> removeStudentFromCourse(@PathVariable int courseId, @PathVariable int registrationId) {
        // Check if course exists and it is not deleted
        final Optional<CourseEntity> course = this.courseRepository.findById(courseId);

        if (!course.isPresent() || course.get().isDeleted()) {
            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course has not been found");
        }

        // Check if the authenticated user is also the owner of the course
        if (course.get().getProfessor().getId() != this.currentUserId()) {
            logger.error(
                "User [{}] has attempted to remove student [{}] from course [{}].",
                this.currentUserName(), registrationId, courseId
            );

            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course has not been found");
        }

        // Get student registration
        final Optional<CourseStudentEntity> registration = this.courseStudentRepository.findById(registrationId);

        if(!registration.isPresent()) {
            return RestResponse.error(CourseErrorCode.REGISTRATION_NOT_FOUND, "The course student has not been found");
        }

        this.courseStudentRepository.delete(registration.get());

        return RestResponse.success();
    }

    /**
     * Upload a CSV file with student registration data
     *
     * @param file uploaded CSV file
     */
    @PostMapping(value = "/action/course/{id}/registrations/upload")
    public RestResponse<?> importStudents(@PathVariable int id, @RequestPart("file") MultipartFile file) {
        // Check if course exists and it is not deleted
        final Optional<CourseEntity> course = this.courseRepository.findById(id);

        if (!course.isPresent() || course.get().isDeleted()) {
            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course has not been found");
        }

        // Check if the authenticated user is also the owner of the course
        if (course.get().getProfessor().getId() != this.currentUserId()) {
            logger.error(
                "User [{}] has attempted to upload a file with student registrations from course [{}].",
                this.currentUserName(), id
            );

            return RestResponse.error(CourseErrorCode.COURSE_NOT_FOUND, "The course has not been found");
        }

        Path path = null;
        try {
            // Create temporary file
            final String extension = FilenameUtils.getExtension(file.getOriginalFilename());
            path = this.createTemporaryFile(file.getBytes(), String.format("course-%d-", id), extension);

            // Configure file format
            final CSVFormat format = CSVFormat.DEFAULT
                .withIgnoreEmptyLines()
                .withDelimiter(',')
                .withTrim();

            // Parse rows
            final List<CourseStudentFileRow> rows = new ArrayList<CourseStudentFileRow>();
            final CourseStudentImportResult result = new CourseStudentImportResult();

            int count = 0;

            try (
                Reader reader = Files.newBufferedReader(path, Charset.forName("UTF-8"));
                CSVParser parser = new CSVParser(reader, format);
            ) {
                for (final CSVRecord record : parser) {
                    count++;
                    // Check number of fields
                    if (record.size() != 3) {
                        result.add(
                            CourseErrorCode.IMPORT_FIELD_MISSING,
                            String.format("Expected 3 values in row %d. Found %d", count, record.size())
                        );
                        continue;
                    }
                    rows.add(new CourseStudentFileRow(count, record.get(0), record.get(1), record.get(2)));
                }
            }

            // Validate rows
            for(final CourseStudentFileRow row: rows) {
                final Set<ConstraintViolation<CourseStudentFileRow>> constraintViolations = this.validator.validate(row);
                if(!constraintViolations.isEmpty()) {
                    result.add(
                        CourseErrorCode.IMPORT_FIELD_INVALID,
                        String.format("Email %S in row %d is invalid", row.getEmail(), row.getIndex())
                    );
                } else {
                    this.addStudentToCourse(course.get(), row.getEmail(), row.getFirstName(), row.getLastName());
                    result.add();
                }
            }

            return RestResponse.result(result);
        } catch (final Exception ex) {
            logger.error(String.format("Failed to import file {} for course {}", file.getOriginalFilename(), id), ex);

            return RestResponse.error(
                CourseErrorCode.IMPORT_ERROR,
                String.format("Failed to import file %s", file.getOriginalFilename())
            );
        } finally {
            if (path != null) {
                FileUtils.deleteQuietly(path.toFile());
            }
        }
    }

    private Path createTemporaryFile(byte[] data, String prefix, String extension) throws IOException {
        final Path path = Files.createTempFile(this.tempDataDirectory, prefix, "." + (extension == null ? "dat" : extension));

        final InputStream in = new ByteArrayInputStream(data);
        Files.copy(in, path, StandardCopyOption.REPLACE_EXISTING);

        return path;
    }

    private CourseStudentEntity addStudentToCourse(CourseEntity course, String email, String firstName, String lastName) {
        // Create white list entry if one does not already exist
        WhiteListEntryEntity entry = this.whiteListRepository.findOneByEmail(email);

        if (entry == null) {
            entry = new WhiteListEntryEntity();

            entry.setEmail(email);

            this.whiteListRepository.saveAndFlush(entry);
        }

        entry.setFirstName(firstName);
        entry.setLastName(lastName);

        if (!entry.hasRole(EnumRole.ROLE_STANDARD_STUDENT)) {
            entry.grant(EnumRole.ROLE_STANDARD_STUDENT, this.accountRepository.findById(this.currentUserId()).get());
        }

        // Create/Update course student registration
        final CourseStudentEntity registration =
            this.courseStudentRepository.findByStudentEmailAndCourseId(email, course.getId()).orElse(new CourseStudentEntity());

        if (registration.getId() == null) {
            registration.setCourse(course);
            registration.setWhiteListEntry(entry);
        }

        this.courseStudentRepository.saveAndFlush(registration);

        return registration;
    }

}
