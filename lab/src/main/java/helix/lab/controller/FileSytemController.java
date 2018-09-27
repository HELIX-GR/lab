package helix.lab.controller;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;

import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.annotation.Secured;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import gr.helix.core.common.model.BasicErrorCode;
import gr.helix.core.common.model.RestResponse;
import helix.lab.controller.action.BaseController;
import helix.lab.model.FileSystemErrorCode;
import helix.lab.model.FileSystemPathRequest;
import helix.lab.model.PublishRequest;
import helix.lab.model.UploadRequest;
import helix.lab.service.CkanServiceProxy;




@RestController
@Secured({ "ROLE_STANDARD", "ROLE_ADMIN" })
@RequestMapping(produces = "application/json")
public class FileSytemController extends BaseController {
	
    @Autowired
    private CkanServiceProxy     ckanServiceProxy;

    private long maxUserSpace;

    @Value("2000000000")// 20mb?
    public void setDefaultLocale(String maxUserSpace) {
        this.maxUserSpace = this.parseSize(maxUserSpace);
    }


    /**
     * Enumerates files and folders for the specified path
     *
     * @param authentication the authenticated principal
     * @param path the path to search
     * @return all files and folders
     */
    @RequestMapping(value = "/action/file-system",  method = RequestMethod.GET)
    public RestResponse<?> browserDirectory() {
        try {
            return RestResponse.result(fileNamingStrategy.getUserDirectoryInfo(currentUserName()));
        } catch (IOException ex) {
            return RestResponse.error(BasicErrorCode.IO_ERROR, "An unknown error has occurred");
        }
    }

    /**
     * Creates a new folder
     *
     * @param request a request with the new folder's name
     * @return the updated file system
     */
    @RequestMapping(value = "/action/file-system", method = RequestMethod.POST)
    public RestResponse<?> createFolder(@RequestBody FileSystemPathRequest request) {
        try {
            if (StringUtils.isEmpty(request.getPath())) {
                return RestResponse.error(FileSystemErrorCode.PATH_IS_EMPTY, "A path is required");
            }

            final String userName = currentUserName();
            final Path dir = fileNamingStrategy.resolvePath(userName, request.getPath());

            if (Files.exists(dir)) {
                return RestResponse.error(
                    FileSystemErrorCode.PATH_ALREADY_EXISTS,
                    String.format("The directory already exists: %s", request.getPath()));
            }

            Files.createDirectories(dir);

            return RestResponse.result(fileNamingStrategy.getUserDirectoryInfo(userName));
        } catch (IOException ex) {
            return RestResponse.error(BasicErrorCode.IO_ERROR, "An unknown error has occurred");
        }
    }

    /**
     * Deletes a file or an empty folder
     *
     * @param request a request with file or folder to delete
     * @return the updated file system
     */
    @RequestMapping(value = "/action/file-system", params = { "path" }, method = RequestMethod.DELETE)
    public RestResponse<?> deletePath(@RequestParam("path") String relativePath) {
        try {
            if (StringUtils.isEmpty(relativePath)) {
                return RestResponse.error(FileSystemErrorCode.PATH_IS_EMPTY, "A path is required");
            }

            final String userName = currentUserName();
            final Path absolutePath = fileNamingStrategy.resolvePath(userName, relativePath);
            final File file = absolutePath.toFile();

            if (!file.exists()) {
                return RestResponse.error(FileSystemErrorCode.PATH_NOT_FOUND, "Path does not exist");
            }
            if ((file.isDirectory()) && (file.listFiles().length != 0)) {
                return RestResponse.error(FileSystemErrorCode.PATH_NOT_EMPTY, "Path is not empty");
            }
            Files.delete(absolutePath);

            return RestResponse.result(fileNamingStrategy.getUserDirectoryInfo(userName));
        } catch (IOException ex) {
            return RestResponse.error(BasicErrorCode.IO_ERROR, "Failed to delete path");
        } catch (Exception ex) {
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

    /**
     * Uploads a file to the given path
     *
     * @param file uploaded resource file
     * @param request request with the file name
     * @throws InvalidProcessDefinitionException
     */
    @RequestMapping(value = "/action/file-system/upload", method = RequestMethod.POST)
    public RestResponse<?> upload(@RequestPart("file") MultipartFile file, @RequestPart("data") UploadRequest request) {

        try {
            final String userName = currentUserName();
            long size = fileNamingStrategy.getUserDirectoryInfo(userName).getSize();
            System.out.println(maxUserSpace);
            if (size + file.getSize() > maxUserSpace) {
                return RestResponse.error(FileSystemErrorCode.NOT_ENOUGH_SPACE, "Insufficient storage space");
            }

           // if (StringUtils.isEmpty(request.getPath())) {
            //    return RestResponse.error(FileSystemErrorCode.PATH_IS_EMPTY, "A path is required");
           // }
            if (StringUtils.isEmpty(request.getFilename())) {
                return RestResponse.error(FileSystemErrorCode.PATH_IS_EMPTY, "File name is not set");
            }

            final Path relativePath = Paths.get(request.getPath(), request.getFilename());
            final Path absolutePath = fileNamingStrategy.resolvePath(userName, relativePath);

            if (Files.exists(absolutePath)) {
                return RestResponse.error(FileSystemErrorCode.PATH_ALREADY_EXISTS, "File with the same name already exists");
            }

            InputStream in = new ByteArrayInputStream(file.getBytes());
            Files.copy(in, absolutePath, StandardCopyOption.REPLACE_EXISTING);

            return RestResponse.result(fileNamingStrategy.getUserDirectoryInfo(currentUserName()));
        } catch (IOException ex) {
            return RestResponse.error(BasicErrorCode.IO_ERROR, "Failed to create file");
        } catch (Exception ex) {
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

    /**
     * Publish a file to ckan
     *
     * @param file uploaded resource file
     * @param request request with the file name
     * @throws InvalidProcessDefinitionException
     */
    @RequestMapping(value = "/action/file-system/publish", method = RequestMethod.POST)
    public RestResponse<?> publish(@RequestBody @Valid PublishRequest request) throws IOException {
    //TODO
    	System.out.println(request.toString() );
        try {
        	 if (StringUtils.isEmpty(request.getFilename())) {
                 return RestResponse.error(FileSystemErrorCode.PATH_IS_EMPTY, "File name is not set");
             }

            final String userName = currentUserName();
            final Path relativePath = Paths.get(request.getPath(), request.getFilename());
            final Path absolutePath = fileNamingStrategy.resolvePath(userName, relativePath);
        	System.out.println(absolutePath.toString() );

            final File file = absolutePath.toFile();

            if (!file.exists()) {
                return RestResponse.error(FileSystemErrorCode.PATH_NOT_FOUND, "Path does not exist");
            }
            if (StringUtils.isEmpty(request.getFilename())) {
                return RestResponse.error(FileSystemErrorCode.PATH_IS_EMPTY, "File name is not set");
            }
            // Create a new dataset
          String package_id = UUID.randomUUID().toString();
          System.out.println(ckanServiceProxy.createNewDataset(request, package_id ));

            return RestResponse.result (ckanServiceProxy.createNewResource(request, file, package_id));
        //    InputStream in = new ByteArrayInputStream(file.getBytes());
          //  Files.copy(in, absolutePath, StandardCopyOption.REPLACE_EXISTING);

          //  return RestResponse.result(fileNamingStrategy.getUserDirectoryInfo(currentUserName()));
        } catch (Exception ex) {
        	System.out.println(ex.toString());
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }
    
    private long parseSize(String size) {
        Assert.hasLength(size, "Size must not be empty");

        size = size.toUpperCase(Locale.ENGLISH);
        if (size.endsWith("KB")) {
            return Long.valueOf(size.substring(0, size.length() - 2)) * 1024;
        }
        if (size.endsWith("MB")) {
            return Long.valueOf(size.substring(0, size.length() - 2)) * 1024 * 1024;
        }
        if (size.endsWith("GB")) {
            return Long.valueOf(size.substring(0, size.length() - 2)) * 1024 * 1024 * 1024;
        }
        return Long.valueOf(size);
    }

}