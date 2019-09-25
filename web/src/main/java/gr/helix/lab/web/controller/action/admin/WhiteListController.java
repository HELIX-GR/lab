package gr.helix.lab.web.controller.action.admin;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gr.helix.core.common.domain.AccountEntity;
import gr.helix.core.common.model.BasicErrorCode;
import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.model.RestResponse;
import gr.helix.core.common.repository.AccountRepository;
import gr.helix.lab.web.controller.action.BaseController;
import gr.helix.lab.web.domain.WhiteListEntryEntity;
import gr.helix.lab.web.model.admin.AdminErrorCode;
import gr.helix.lab.web.model.admin.WhiteListEntry;
import gr.helix.lab.web.repository.WhiteListRepository;

@RestController
@Secured({"ROLE_ADMIN"})
@RequestMapping(produces = "application/json")
public class WhiteListController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(WhiteListController.class);

    @Autowired
    AccountRepository           accountRepository;

    @Autowired
    WhiteListRepository         whiteListRepository;

    /**
     * Get all users from the white list
     *
     * @return
     */
    @RequestMapping(value = "action/admin/white-list/users", method = RequestMethod.GET)
    public RestResponse<?> getEntries() {
        final List<WhiteListEntry> entries = this.whiteListRepository.findAll().stream()
            .map(e -> e.toDto())
            .collect(Collectors.toList());

        return RestResponse.result(entries);
    }

    /**
     * Adds a user to the white list
     *
     * @param entry
     * @param results
     * @return
     */
    @RequestMapping(value = "/action/admin/white-list/user", method = RequestMethod.POST)
    public RestResponse<Void> createEntry(@RequestBody @Valid WhiteListEntry data, BindingResult results) {
        try {
            // Validate request data
            if (results.hasErrors()) {
                return RestResponse.invalid(results.getFieldErrors());
            }

            // Check if user already exists in the white list
            WhiteListEntryEntity entry = this.whiteListRepository.findOneByEmail(data.getEmail());

            if (entry != null) {
                return RestResponse.error(AdminErrorCode.WHITE_LIST_ENTRY_EXISTS, "White list entry already exists");
            } else {
                // Create a new white list entry
                entry = new WhiteListEntryEntity(data.getEmail());

                entry.setFirstName(data.getFirstName());
                entry.setLastName(data.getLastName());

                for (final EnumRole e : data.getRoles()) {
                    entry.grant(e, this.accountRepository.findById(this.currentUserId()).get());
                }

                this.whiteListRepository.save(entry);
            }
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);

            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }

        return RestResponse.success();
    }

    /**
     * Grant role to white list user
     *
     * @param userId
     * @param role
     * @return
     */
    @RequestMapping(value = "action/admin/white-list/user/{userId}/role/{role}", method = RequestMethod.POST)
    public RestResponse<?> grantRole(@PathVariable int userId, @PathVariable EnumRole role) {
        try {
            final Optional<WhiteListEntryEntity> entry = this.whiteListRepository.findById(userId);
            if (!entry.isPresent()) {
                return RestResponse.error(AdminErrorCode.WHITE_LIST_ENTRY_NOT_FOUND, "White list entry was not found");
            }

            final Optional<AccountEntity> grantedBy = this.accountRepository.findById(this.currentUserId());
            if (!grantedBy.isPresent()) {
                return RestResponse.error(AdminErrorCode.ACCOUNT_NOT_FOUND, "Account was not found");
            }

            entry.get().grant(role, grantedBy.get());
            this.whiteListRepository.save(entry.get());

            return RestResponse.result(entry.get().toDto());
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);

            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }
    }

    @RequestMapping(value = "action/admin/white-list/user/{userId}/role/{role}", method = RequestMethod.DELETE)
    public RestResponse<?> revokeRole(@PathVariable int userId, @PathVariable EnumRole role) {
        try {
            final Optional<WhiteListEntryEntity> entry = this.whiteListRepository.findById(userId);
            if (!entry.isPresent()) {
                return RestResponse.error(AdminErrorCode.WHITE_LIST_ENTRY_NOT_FOUND, "White list entry was not found");
            }

            final Optional<AccountEntity> grantedBy = this.accountRepository.findById(this.currentUserId());
            if (!grantedBy.isPresent()) {
                return RestResponse.error(AdminErrorCode.ACCOUNT_NOT_FOUND, "Account was not found");
            }

            entry.get().revoke(role);
            this.whiteListRepository.save(entry.get());

            return RestResponse.result(entry.get().toDto());
        } catch (final Exception ex) {
            logger.error(ex.getMessage(), ex);

            return RestResponse.error(BasicErrorCode.UNKNOWN, "An unknown error has occurred");
        }

    }

}
