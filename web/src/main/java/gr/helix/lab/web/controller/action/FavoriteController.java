package gr.helix.lab.web.controller.action;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.model.ApplicationException;
import gr.helix.core.common.model.BasicErrorCode;
import gr.helix.core.common.model.Error;
import gr.helix.core.common.model.RestResponse;
import gr.helix.core.common.model.user.Favorite;
import gr.helix.core.common.model.user.FavoriteCollection;
import gr.helix.core.common.model.user.FavoriteCollectionRequest;
import gr.helix.core.common.model.user.FavouriteRequest;
import gr.helix.core.common.repository.IFavoriteRepository;
import gr.helix.core.common.service.IFavoriteValidationService;

@RestController("actionFavouriteController")
@RequestMapping(produces = "application/json")
@Secured({ "ROLE_USER", "ROLE_ADMIN" })
public class FavoriteController extends BaseController {

    private static final Logger        logger = LoggerFactory.getLogger(FavoriteController.class);

    @Autowired
    private IFavoriteRepository        favoriteRepository;

    @Autowired
    private IFavoriteValidationService favoriteValidationService;

    @PostMapping(value = "/action/favorite")
    public RestResponse<?> favorite(@RequestBody FavouriteRequest request) {
        // Set mail for the authenticated user
        request.setEmail(this.currentUserEmail());

        final List<Error> errors = this.favoriteValidationService.validate(request);
        if (!errors.isEmpty()) {
            return RestResponse.error(errors);
        }

        try {
            switch (request.getAction()) {
                case ADD:
                    final Favorite favorite = this.favoriteRepository.addFavorite(
                        request.getEmail(),
                        request.getCatalog(),
                        request.getHandle(),
                        request.getUrl(),
                        request.getTitle(),
                        request.getDescription()
                    );

                    return RestResponse.result(favorite);
                case REMOVE:
                    final List<FavoriteCollection> collections =
                        this.favoriteRepository.removeFavorite(request.getEmail(), request.getCatalog(), request.getHandle());

                    return RestResponse.result(collections);
                case LIST:
                    final List<Favorite> favorites = this.favoriteRepository.getFavoritesByEmail(request.getEmail());
                    return RestResponse.result(favorites);
                default:
                    // No action
                    break;
            }
        } catch (final ApplicationException ex) {
            return RestResponse.error(ex.getErrorCode(), ex.getMessage());
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown exception has occurred.");
        }

        return RestResponse.success();
    }

    @PostMapping(value = "/action/collection")
    public RestResponse<?> addCollection(@RequestBody FavoriteCollectionRequest request) {
        final List<Error> errors = this.favoriteValidationService.validate(request);
        if (!errors.isEmpty()) {
            return RestResponse.error(errors);
        }

        try {
            final FavoriteCollection collection = this.favoriteRepository.addCollection(this.currentUserEmail(),  request.getTitle());

            return RestResponse.result(collection);
        } catch (final ApplicationException ex) {
            return RestResponse.error(ex.getErrorCode(), ex.getMessage());
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown exception has occurred.");
        }
    }

    @PutMapping(value = "/action/collection")
    public RestResponse<?> updateCollection(@RequestBody FavoriteCollectionRequest request) {
        final List<Error> errors = this.favoriteValidationService.validate(request);
        if (!errors.isEmpty()) {
            return RestResponse.error(errors);
        }

        try {
            final FavoriteCollection collection = this.favoriteRepository.updateCollection(this.currentUserEmail(), request.getId(), request.getTitle());

            return RestResponse.result(collection);
        } catch (final ApplicationException ex) {
            return RestResponse.error(ex.getErrorCode(), ex.getMessage());
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown exception has occurred.");
        }
    }

    @DeleteMapping(value = "/action/collection/{id}")
    public RestResponse<?> removeCollection(@PathVariable int id) {
        try {
            this.favoriteRepository.removeCollection(this.currentUserEmail(), id);
        } catch (final ApplicationException ex) {
            return RestResponse.error(ex.getErrorCode(), ex.getMessage());
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown exception has occurred.");
        }

        return RestResponse.success();
    }

    @PostMapping(value = "/action/collection/{collectionId}/favorite/{favoriteId}")
    public RestResponse<?> addFavoriteToCollection(@PathVariable int collectionId, @PathVariable int favoriteId) {
        try {
            final FavoriteCollection collection =
                this.favoriteRepository.addFavoriteToCollection(this.currentUserEmail(), collectionId, favoriteId);

            return RestResponse.result(collection);
        } catch (final ApplicationException ex) {
            return RestResponse.error(ex.getErrorCode(), ex.getMessage());
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown exception has occurred.");
        }
    }

    @DeleteMapping(value = "/action/collection/{collectionId}/favorite/{favoriteId}")
    public RestResponse<?> removeFavoriteFromCollection(@PathVariable int collectionId, @PathVariable int favoriteId) {
        try {
            final FavoriteCollection collection =
                this.favoriteRepository.removeFavoriteFromCollection(this.currentUserEmail(), collectionId, favoriteId);

            return RestResponse.result(collection);
        } catch (final ApplicationException ex) {
            return RestResponse.error(ex.getErrorCode(), ex.getMessage());
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);
            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown exception has occurred.");
        }
    }

}
