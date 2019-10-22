package gr.helix.lab.web.controller.action;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.velocity.shaded.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import gr.helix.core.common.model.ApplicationException;
import gr.helix.core.common.model.BasicErrorCode;
import gr.helix.core.common.model.RestResponse;
import gr.helix.lab.web.model.FileSystemErrorCode;
import gr.helix.lab.web.model.FileSystemPathRequest;
import gr.helix.lab.web.model.NotebookErrorCode;
import gr.helix.lab.web.model.PublishRequest;
import gr.helix.lab.web.model.UploadRequest;
import gr.helix.lab.web.model.ckan.Package;
import gr.helix.lab.web.model.ckan.Resource;
import gr.helix.lab.web.service.CkanServiceProxy;
import gr.helix.lab.web.service.SearchService;

@RestController
@Secured({ "ROLE_STANDARD", "ROLE_ADMIN" })
@RequestMapping(produces = "application/json")
public class FileSytemController extends BaseController {

    private final static String NOTEBOOK_EXTENSION = "ipynb";

    @Autowired
    private HttpClient          httpClient;

    @Autowired
    private CkanServiceProxy    ckanServiceProxy;

    @Autowired
    private SearchService       searchService;

    private long                maxUserSpace;

    @Value("${lab.user.max-space:20971520}")
    public void setMaxUserSpace(String maxUserSpace) {
        this.maxUserSpace = this.parseSize(maxUserSpace);
    }

    /**
     * Enumerates files and folders for the specified path
     *
     * @param authentication the authenticated principal
     * @param path the path to search
     * @return all files and folders
     */
    @GetMapping(value = "/action/file-system")
    public RestResponse<?> browserDirectory() {
        try {
            return RestResponse.result(this.fileNamingStrategy.getUserDirectoryInfo(this.currentUserName()));
        } catch (final IOException ex) {
            return RestResponse.error(BasicErrorCode.IO_ERROR, "An unknown error has occurred");
        }
    }

    /**
     * Creates a new folder
     *
     * @param request a request with the new folder's name
     * @return the updated file system
     */
    @PostMapping(value = "/action/file-system")
    public RestResponse<?> createFolder(@RequestBody FileSystemPathRequest request) {
        try {
            if (StringUtils.isEmpty(request.getPath())) {
                return RestResponse.error(FileSystemErrorCode.PATH_IS_EMPTY, "A path is required");
            }

            final String userName = this.currentUserName();
            final Path dir = this.fileNamingStrategy.resolvePath(userName, request.getPath());

            if (Files.exists(dir)) {
                return RestResponse.error(FileSystemErrorCode.PATH_ALREADY_EXISTS, "A folder with the same name already exists");
            }

            Files.createDirectories(dir);

            return RestResponse.result(this.fileNamingStrategy.getUserDirectoryInfo(userName));
        } catch (final IOException ex) {
            return RestResponse.error(BasicErrorCode.IO_ERROR, "An unknown error has occurred");
        }
    }

    /**
     * Deletes a file or an empty folder
     *
     * @param request a request with file or folder to delete
     * @return the updated file system
     */
    @DeleteMapping(value = "/action/file-system", params = { "path" })
    public RestResponse<?> deletePath(@RequestParam("path") String relativePath) {
        try {
            if (StringUtils.isEmpty(relativePath)) {
                return RestResponse.error(FileSystemErrorCode.PATH_IS_EMPTY, "A path is required");
            }

            final String userName = this.currentUserName();
            final Path absolutePath = this.fileNamingStrategy.resolvePath(userName, relativePath);
            final File file = absolutePath.toFile();

            if (!file.exists()) {
                return RestResponse.error(FileSystemErrorCode.PATH_NOT_FOUND, "Path does not exist");
            }
            if ((file.isDirectory()) && (file.listFiles().length != 0)) {
                return RestResponse.error(FileSystemErrorCode.PATH_NOT_EMPTY, "Path is not empty");
            }
            Files.delete(absolutePath);

            return RestResponse.result(this.fileNamingStrategy.getUserDirectoryInfo(userName));
        } catch (final IOException ex) {
            return RestResponse.error(BasicErrorCode.IO_ERROR, "Failed to delete path");
        } catch (final Exception ex) {
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
    @PostMapping(value = "/action/file-system/upload")
    public RestResponse<?> upload(@RequestPart("file") MultipartFile file, @RequestPart("data") UploadRequest request) {

        try {
            final String userName = this.currentUserName();
            final long size = this.fileNamingStrategy.getUserDirectoryInfo(userName).getSize();

            if (size + file.getSize() > this.maxUserSpace) {
                return RestResponse.error(FileSystemErrorCode.NOT_ENOUGH_SPACE, "Insufficient storage space");
            }

            if (StringUtils.isEmpty(request.getFilename())) {
                return RestResponse.error(FileSystemErrorCode.PATH_IS_EMPTY, "File name is not set");
            }

            final Path relativePath = Paths.get(request.getPath(), request.getFilename());
            final Path absolutePath = this.fileNamingStrategy.resolvePath(userName, relativePath);

            if (Files.exists(absolutePath)) {
                return RestResponse.error(FileSystemErrorCode.PATH_ALREADY_EXISTS, "A file with the same name already exists");
            }

            final InputStream in = new ByteArrayInputStream(file.getBytes());
            Files.copy(in, absolutePath, StandardCopyOption.REPLACE_EXISTING);

            return RestResponse.result(this.fileNamingStrategy.getUserDirectoryInfo(this.currentUserName()));
        } catch (final IOException ex) {
            return RestResponse.error(BasicErrorCode.IO_ERROR, "Failed to create file");
        } catch (final Exception ex) {
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

    /**
     * Publish a file to CKAN
     *
     * @param file uploaded resource file
     * @param request request with the file name
     * @throws InvalidProcessDefinitionException
     */
    @PostMapping(value = "/action/file-system/notebook")
    public RestResponse<?> publish(Authentication authentication, @RequestBody @Valid PublishRequest request) throws IOException {
        try {
            if (StringUtils.isEmpty(request.getFilename())) {
                return RestResponse.error(FileSystemErrorCode.PATH_IS_EMPTY, "File name is not set");
            }

            final String userName = this.currentUserName();

            final Path relativePath = Paths.get(request.getPath(), request.getFilename());
            final Path absolutePath = this.fileNamingStrategy.resolvePath(userName, relativePath);

            final File file = absolutePath.toFile();

            if (!file.exists()) {
                return RestResponse.error(FileSystemErrorCode.PATH_NOT_FOUND, "Path does not exist");
            }
            if (StringUtils.isEmpty(request.getFilename())) {
                return RestResponse.error(FileSystemErrorCode.PATH_IS_EMPTY, "File name is not set");
            }
            if (!FilenameUtils.getExtension(file.toString()).equals(NOTEBOOK_EXTENSION)) {
                return RestResponse.error(FileSystemErrorCode.EXTENSION_NOT_SUPPORTED, "File name extension is not supported");
            }

            final Package dataset = this.ckanServiceProxy.createDataset(request, userName);

            // TODO: Check CKAN
            TimeUnit.SECONDS.sleep(2);

            final Resource resource = this.ckanServiceProxy.createResource(request, file, dataset.getId());

            return RestResponse.result(resource);
        } catch (final Exception ex) {
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

    /**
     * Download file from CKAN to user file system
     *
     * @param file uploaded resource file
     * @param request request with the file name
     * @throws InvalidProcessDefinitionException
     */
    @GetMapping(value = "/action/file-system/notebook/{id}")
    public RestResponse<?> getNotebook(Authentication authentication, @PathVariable("id") String id) throws IOException {
        try {
            if (StringUtils.isEmpty(id)) {
                return RestResponse.error(NotebookErrorCode.NOTEBOOK_ID_MISSING, "Notebook id is required");
            }

            final String userName = this.currentUserName();

            final Path dir = this.fileNamingStrategy.resolvePath(userName, "Published");

            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }

            final Package dataset = this.searchService.getDataset(id);
            final Resource resource = dataset.getResources().get(0);

            final Path target = this.fileNamingStrategy.resolvePath(userName, "Published/" + resource.getName());

            final HttpUriRequest request = RequestBuilder.get(resource.getUrl()).build();

            try (CloseableHttpResponse response = (CloseableHttpResponse) this.httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw ApplicationException.fromMessage("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
                }

                Files.copy(response.getEntity().getContent(), target, StandardCopyOption.REPLACE_EXISTING);
            }

            return RestResponse.success();
        } catch (final Exception ex) {
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