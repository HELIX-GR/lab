package gr.helix.lab.web.config;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.servlet.Filter;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.protocol.Protocol;
import org.apache.commons.httpclient.protocol.ProtocolSocketFactory;
import org.apache.velocity.app.VelocityEngine;
import org.opensaml.saml2.core.NameIDType;
import org.opensaml.saml2.metadata.provider.HTTPMetadataProvider;
import org.opensaml.saml2.metadata.provider.MetadataProvider;
import org.opensaml.saml2.metadata.provider.MetadataProviderException;
import org.opensaml.xml.parse.ParserPool;
import org.opensaml.xml.parse.StaticBasicParserPool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.config.MethodInvokingFactoryBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.filter.OAuth2ClientAuthenticationProcessingFilter;
import org.springframework.security.oauth2.client.filter.OAuth2ClientContextFilter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableOAuth2Client;
import org.springframework.security.saml.SAMLAuthenticationProvider;
import org.springframework.security.saml.SAMLBootstrap;
import org.springframework.security.saml.SAMLDiscovery;
import org.springframework.security.saml.SAMLEntryPoint;
import org.springframework.security.saml.SAMLProcessingFilter;
import org.springframework.security.saml.SAMLWebSSOHoKProcessingFilter;
import org.springframework.security.saml.context.SAMLContextProviderImpl;
import org.springframework.security.saml.key.JKSKeyManager;
import org.springframework.security.saml.key.KeyManager;
import org.springframework.security.saml.log.SAMLDefaultLogger;
import org.springframework.security.saml.metadata.CachingMetadataManager;
import org.springframework.security.saml.metadata.ExtendedMetadata;
import org.springframework.security.saml.metadata.ExtendedMetadataDelegate;
import org.springframework.security.saml.metadata.MetadataDisplayFilter;
import org.springframework.security.saml.metadata.MetadataGenerator;
import org.springframework.security.saml.metadata.MetadataGeneratorFilter;
import org.springframework.security.saml.parser.ParserPoolHolder;
import org.springframework.security.saml.processor.HTTPArtifactBinding;
import org.springframework.security.saml.processor.HTTPPAOS11Binding;
import org.springframework.security.saml.processor.HTTPPostBinding;
import org.springframework.security.saml.processor.HTTPRedirectDeflateBinding;
import org.springframework.security.saml.processor.HTTPSOAP11Binding;
import org.springframework.security.saml.processor.SAMLBinding;
import org.springframework.security.saml.processor.SAMLProcessorImpl;
import org.springframework.security.saml.storage.EmptyStorageFactory;
import org.springframework.security.saml.trust.httpclient.TLSProtocolConfigurer;
import org.springframework.security.saml.trust.httpclient.TLSProtocolSocketFactory;
import org.springframework.security.saml.util.VelocityFactory;
import org.springframework.security.saml.websso.ArtifactResolutionProfile;
import org.springframework.security.saml.websso.ArtifactResolutionProfileImpl;
import org.springframework.security.saml.websso.WebSSOProfile;
import org.springframework.security.saml.websso.WebSSOProfileConsumer;
import org.springframework.security.saml.websso.WebSSOProfileConsumerHoKImpl;
import org.springframework.security.saml.websso.WebSSOProfileConsumerImpl;
import org.springframework.security.saml.websso.WebSSOProfileImpl;
import org.springframework.security.saml.websso.WebSSOProfileOptions;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.channel.ChannelProcessingFilter;
import org.springframework.security.web.authentication.DelegatingAuthenticationEntryPoint;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.switchuser.SwitchUserFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.filter.CompositeFilter;

import gr.helix.core.common.repository.AccountRepository;
import gr.helix.lab.web.logging.filter.MappedDiagnosticContextFilter;
import gr.helix.lab.web.service.CustomUserDetailsService;
import gr.helix.lab.web.service.OAuthUserInfoTokenServices;
import gr.helix.lab.web.service.SAMLUserDetailsServiceImpl;

@Configuration
@EnableGlobalMethodSecurity(securedEnabled = true)
@EnableOAuth2Client
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private static final String                API_REG_EX    = "/api/v\\d+/.*";

    private static final String                ACTION_REG_EX = "/action/.*";

    private Timer                              backgroundTaskTimer;

    private MultiThreadedHttpConnectionManager multiThreadedHttpConnectionManager;

    private final RegexRequestMatcher          samlMatcher   = new RegexRequestMatcher("/saml/.*", null);

    private final Pattern                      csrfMethods   = Pattern.compile("^(POST|PUT|DELETE)$");

    @Autowired
    AccountRepository                          accountRepository;

    @Autowired
    OAuthUserInfoDetailResolver                userInfoDetailResolver;

    @Autowired
    private SamlConfiguration                  samlConfiguration;

    @PostConstruct
    public void init() {
        this.backgroundTaskTimer = new Timer(true);
        this.multiThreadedHttpConnectionManager = new MultiThreadedHttpConnectionManager();
    }

    @PreDestroy
    public void destroy() {
        this.backgroundTaskTimer.purge();
        this.backgroundTaskTimer.cancel();
        this.multiThreadedHttpConnectionManager.shutdown();
    }

    @Autowired
    private SAMLUserDetailsServiceImpl samlUserDetailsServiceImpl;

    /**
     * Initialization of the velocity engine
     *
     * @return
     */
    @Bean
    public VelocityEngine velocityEngine() {
        return VelocityFactory.getEngine();
    }

    /**
     * XML parser pool needed for OpenSAML parsing
     *
     * @return
     */
    @Bean(initMethod = "initialize")
    public StaticBasicParserPool parserPool() {
        return new StaticBasicParserPool();
    }

    @Bean(name = "parserPoolHolder")
    public ParserPoolHolder parserPoolHolder() {
        return new ParserPoolHolder();
    }

    /**
     * Bindings, encoders and decoders used for creating and parsing messages
     *
     * @return
     */
    @Bean
    public HttpClient httpClient() {
        return new HttpClient(this.multiThreadedHttpConnectionManager);
    }

    /**
     * SAML Authentication Provider responsible for validating of received SAML
     * messages
     *
     * @return
     */
    @Bean
    public SAMLAuthenticationProvider samlAuthenticationProvider() {
        final SAMLAuthenticationProvider samlAuthenticationProvider = new SAMLAuthenticationProvider();
        samlAuthenticationProvider.setUserDetails(this.samlUserDetailsServiceImpl);
        samlAuthenticationProvider.setForcePrincipalAsString(false);
        return samlAuthenticationProvider;
    }

    /**
     * Provider of default SAML Context
     *
     * @return
     */
    @Profile("production")
    @Qualifier("SAMLContextProviderImpl")
    @Bean
    public SAMLContextProviderImpl contextProviderWithHttpSessionStorage() {
        return new SAMLContextProviderImpl();
    }

    /**
     * Provider of default SAML Context
     *
     * See https://docs.spring.io/spring-security-saml/docs/current/reference/html/chapter-troubleshooting.html
     *
     * @return
     */
    @Profile("!production")
    @Qualifier("SAMLContextProviderImpl")
    @Bean
    public SAMLContextProviderImpl contextProviderWithEmptyStorage() {
        final SAMLContextProviderImpl provider = new SAMLContextProviderImpl();
        provider.setStorageFactory(new EmptyStorageFactory());
        return provider;
    }

    /**
     * Initialization of OpenSAML library
     *
     * @return
     */
    @Bean
    public static SAMLBootstrap sAMLBootstrap() {
        return new SAMLBootstrap();
    }

    /**
     * Logger for SAML messages and events
     *
     * @return
     */
    @Bean
    public SAMLDefaultLogger samlLogger() {
        return new SAMLDefaultLogger();
    }

    /**
     * SAML 2.0 WebSSO Assertion Consumer
     *
     * @return
     */
    @Bean
    public WebSSOProfileConsumer webSSOprofileConsumer() {
        return new WebSSOProfileConsumerImpl();
    }

    /**
     * SAML 2.0 Holder-of-Key WebSSO Assertion Consumer
     *
     * @return
     */
    @Bean
    public WebSSOProfileConsumerHoKImpl hokWebSSOprofileConsumer() {
        return new WebSSOProfileConsumerHoKImpl();
    }

    /**
     * SAML 2.0 Web SSO profile
     *
     * @return
     */
    @Bean
    public WebSSOProfile webSSOprofile() {
        return new WebSSOProfileImpl();
    }

    /**
     * SAML 2.0 Holder-of-Key Web SSO profile
     *
     * @return
     */
    @Bean
    public WebSSOProfileConsumerHoKImpl hokWebSSOProfile() {
        return new WebSSOProfileConsumerHoKImpl();
    }

    /**
     * Central storage of cryptographic keys
     *
     * @return
     */
    @Bean
    public KeyManager keyManager() {
        final DefaultResourceLoader loader = new DefaultResourceLoader();

        final Resource storeFile = loader.getResource(this.samlConfiguration.getStoreFile());
        final String storePass = this.samlConfiguration.getStorePassword();
        final Map<String, String> passwords = new HashMap<String, String>();
        passwords.put(this.samlConfiguration.getClient(), this.samlConfiguration.getClientPassword());
        final String defaultKey = this.samlConfiguration.getClient();

        return new JKSKeyManager(storeFile, storePass, passwords, defaultKey);
    }

    /**
     * Setup TLS Socket Factory
     *
     * @return
     */
    @Bean
    public TLSProtocolConfigurer tlsProtocolConfigurer() {
        return new TLSProtocolConfigurer();
    }

    @Bean
    public ProtocolSocketFactory socketFactory() {
        return new TLSProtocolSocketFactory(this.keyManager(), null, "default");
    }

    @Bean
    public Protocol socketFactoryProtocol() {
        return new Protocol("https", this.socketFactory(), 443);
    }

    @Bean
    public MethodInvokingFactoryBean socketFactoryInitialization() {
        final MethodInvokingFactoryBean methodInvokingFactoryBean = new MethodInvokingFactoryBean();
        methodInvokingFactoryBean.setTargetClass(Protocol.class);
        methodInvokingFactoryBean.setTargetMethod("registerProtocol");
        final Object[] args = { "https", this.socketFactoryProtocol() };
        methodInvokingFactoryBean.setArguments(args);
        return methodInvokingFactoryBean;
    }

    @Bean
    public WebSSOProfileOptions defaultWebSSOProfileOptions() {
        final WebSSOProfileOptions webSSOProfileOptions = new WebSSOProfileOptions();
        webSSOProfileOptions.setIncludeScoping(false);
        return webSSOProfileOptions;
    }

    /**
     * Entry point to initialize authentication, default values taken from
     * properties file
     *
     * @return
     */
    @Bean
    public SAMLEntryPoint samlEntryPoint() {
        final SAMLEntryPoint samlEntryPoint = new SAMLEntryPoint();
        samlEntryPoint.setDefaultProfileOptions(this.defaultWebSSOProfileOptions());
        return samlEntryPoint;
    }

    /**
     * Setup advanced info about metadata
     *
     * @return
     */
    @Bean
    public ExtendedMetadata extendedMetadata() {
        final ExtendedMetadata extendedMetadata = new ExtendedMetadata();
        extendedMetadata.setIdpDiscoveryEnabled(true);
        extendedMetadata.setSignMetadata(false);
        extendedMetadata.setEcpEnabled(false);
        return extendedMetadata;
    }

    /**
     * IDP Discovery Service
     *
     * @return
     */
    @Bean
    public SAMLDiscovery samlIDPDiscovery() {
        final SAMLDiscovery idpDiscovery = new SAMLDiscovery();
        idpDiscovery.setIdpSelectionPath("/saml/idp-select");
        return idpDiscovery;
    }

    public ExtendedMetadataDelegate createExtendedMetadataProvider(String metadataURL) throws MetadataProviderException {
        final HTTPMetadataProvider httpMetadataProvider = new HTTPMetadataProvider(this.backgroundTaskTimer, this.httpClient(), metadataURL);
        httpMetadataProvider.setParserPool(this.parserPool());
        final ExtendedMetadataDelegate extendedMetadataDelegate = new ExtendedMetadataDelegate(httpMetadataProvider, this.extendedMetadata());
        extendedMetadataDelegate.setMetadataRequireSignature(false);
        extendedMetadataDelegate.setMetadataTrustCheck(false);
        this.backgroundTaskTimer.purge();
        return extendedMetadataDelegate;
    }

    /**
     * IDP Metadata configuration
     * <p>
     * Do no forget to call initialize method on providers
     *
     * @return
     * @throws MetadataProviderException
     */
    @Bean
    @Qualifier("metadata")
    public CachingMetadataManager metadata() throws MetadataProviderException {
        final List<MetadataProvider> providers = new ArrayList<MetadataProvider>();

        for(final String metadataURL : this.samlConfiguration.getMetadata()) {
            final ExtendedMetadataDelegate metadata = this.createExtendedMetadataProvider(metadataURL);
            providers.add(metadata);
        }

        return new CachingMetadataManager(providers);
    }

    /**
     * Filter automatically generates default SP metadata
     *
     * @return
     */
    @Bean
    public MetadataGenerator metadataGenerator() {
        final MetadataGenerator metadataGenerator = new MetadataGenerator();
        metadataGenerator.setEntityId("https://localtest.hellenicdataservice.gr/shibboleth");
        metadataGenerator.setNameID(Arrays.asList(NameIDType.PERSISTENT));
        metadataGenerator.setExtendedMetadata(this.extendedMetadata());
        metadataGenerator.setIncludeDiscoveryExtension(false);
        metadataGenerator.setKeyManager(this.keyManager());
        return metadataGenerator;
    }

    /**
     * The filter is waiting for connections on URL suffixed with filterSuffix and
     * presents SP metadata there
     *
     * @return
     */
    @Bean
    public MetadataDisplayFilter metadataDisplayFilter() {
        return new MetadataDisplayFilter();
    }

    // Handler deciding where to redirect user after failed login
    @Bean
    public SimpleUrlAuthenticationFailureHandler authenticationFailureHandler() {
        final SimpleUrlAuthenticationFailureHandler failureHandler = new SimpleUrlAuthenticationFailureHandler();
        failureHandler.setUseForward(true);
        failureHandler.setDefaultFailureUrl("/login");
        return failureHandler;
    }

    @Bean
    public SAMLWebSSOHoKProcessingFilter samlWebSSOHoKProcessingFilter() throws Exception {
        final SAMLWebSSOHoKProcessingFilter samlWebSSOHoKProcessingFilter = new SAMLWebSSOHoKProcessingFilter();
        samlWebSSOHoKProcessingFilter.setAuthenticationManager(this.authenticationManager());
        samlWebSSOHoKProcessingFilter.setAuthenticationFailureHandler(this.authenticationFailureHandler());
        return samlWebSSOHoKProcessingFilter;
    }

    // Processing filter for WebSSO profile messages
    @Bean
    public SAMLProcessingFilter samlWebSSOProcessingFilter() throws Exception {
        final SAMLProcessingFilter samlWebSSOProcessingFilter = new SAMLProcessingFilter();
        samlWebSSOProcessingFilter.setAuthenticationManager(this.authenticationManager());
        samlWebSSOProcessingFilter.setAuthenticationFailureHandler(this.authenticationFailureHandler());
        return samlWebSSOProcessingFilter;
    }

    @Bean
    public MetadataGeneratorFilter metadataGeneratorFilter() {
        return new MetadataGeneratorFilter(this.metadataGenerator());
    }

    // Bindings
    private ArtifactResolutionProfile artifactResolutionProfile() {
        final ArtifactResolutionProfileImpl artifactResolutionProfile = new ArtifactResolutionProfileImpl(
                this.httpClient());
        artifactResolutionProfile.setProcessor(new SAMLProcessorImpl(this.soapBinding()));
        return artifactResolutionProfile;
    }

    @Bean
    public HTTPArtifactBinding artifactBinding(ParserPool parserPool, VelocityEngine velocityEngine) {
        return new HTTPArtifactBinding(parserPool, velocityEngine, this.artifactResolutionProfile());
    }

    @Bean
    public HTTPSOAP11Binding soapBinding() {
        return new HTTPSOAP11Binding(this.parserPool());
    }

    @Bean
    public HTTPPostBinding httpPostBinding() {
        return new HTTPPostBinding(this.parserPool(), this.velocityEngine());
    }

    @Bean
    public HTTPRedirectDeflateBinding httpRedirectDeflateBinding() {
        return new HTTPRedirectDeflateBinding(this.parserPool());
    }

    @Bean
    public HTTPSOAP11Binding httpSOAP11Binding() {
        return new HTTPSOAP11Binding(this.parserPool());
    }

    @Bean
    public HTTPPAOS11Binding httpPAOS11Binding() {
        return new HTTPPAOS11Binding(this.parserPool());
    }

    // Processor
    @Bean
    public SAMLProcessorImpl processor() {
        final Collection<SAMLBinding> bindings = new ArrayList<SAMLBinding>();
        bindings.add(this.httpRedirectDeflateBinding());
        bindings.add(this.httpPostBinding());
        bindings.add(this.artifactBinding(this.parserPool(), this.velocityEngine()));
        bindings.add(this.httpSOAP11Binding());
        bindings.add(this.httpPAOS11Binding());
        return new SAMLProcessorImpl(bindings);
    }

    /**
     * Define the security filter chain in order to support SSO Auth by using SAML
     * 2.0
     *
     * @return Filter chain proxy
     * @throws Exception
     */
    @Bean
    public FilterChainProxy samlFilter() throws Exception {
        final List<SecurityFilterChain> chains = new ArrayList<SecurityFilterChain>();
        chains.add(new DefaultSecurityFilterChain(new AntPathRequestMatcher("/saml/login/**"), this.samlEntryPoint()));
        chains.add(new DefaultSecurityFilterChain(new AntPathRequestMatcher("/saml/metadata/**"), this.metadataDisplayFilter()));
        chains.add(new DefaultSecurityFilterChain(new AntPathRequestMatcher("/saml/SSO/**"), this.samlWebSSOProcessingFilter()));
        chains.add(new DefaultSecurityFilterChain(new AntPathRequestMatcher("/saml/SSOHoK/**"), this.samlWebSSOHoKProcessingFilter()));
        chains.add(new DefaultSecurityFilterChain(new AntPathRequestMatcher("/saml/discovery/**"), this.samlIDPDiscovery()));
        return new FilterChainProxy(chains);
    }

    /**
     * Returns the authentication manager currently used by Spring. It represents a
     * bean definition with the aim allow wiring from other classes performing the
     * Inversion of Control (IoC).
     *
     * @throws Exception
     */
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    public SimpleUrlAuthenticationFailureHandler oauth2FailureHandler() {
        final SimpleUrlAuthenticationFailureHandler handler = new SimpleUrlAuthenticationFailureHandler();
        handler.setDefaultFailureUrl("/error/401");
        return handler;
    }

    @Autowired
    @Qualifier("defaultUserDetailsService")
    CustomUserDetailsService userService;

    @Autowired
    OAuth2ClientContext      oauth2ClientContext;

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        final LinkedHashMap<RequestMatcher, AuthenticationEntryPoint> map = new LinkedHashMap<RequestMatcher, AuthenticationEntryPoint>();

        map.put(new RegexRequestMatcher(API_REG_EX, null), new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));
        map.put(new RegexRequestMatcher(ACTION_REG_EX, null), new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));

        final DelegatingAuthenticationEntryPoint entryPoint = new DelegatingAuthenticationEntryPoint(map);
        entryPoint.setDefaultEntryPoint(new LoginUrlAuthenticationEntryPoint("/"));

        return entryPoint;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            // Public
            .antMatchers(
                "/",
                // Site parts
                "/admin/",
                "/error/**",
                "/filesystem/",
                "/notebook/**",
                "/results/",
                // Assets
                "/favicon.ico",
                "/css/**",
                "/fonts/**",
                "/i18n/**",
                "/images/**",
                "/js/**",
                "/vendor/**",
                // Authentication endpoints
                "/login**",
                "/logged-out",
                // Error pages
                "/error**",
                // SAML endpoints
                "/saml/**",
                // Public action API endpoints
                "/action/catalog/**",
                "/action/ckan/**",
                "/action/configuration/**"
             ).permitAll()
            // Private action API endpoints
            .antMatchers(
                "/logged-in",
                "/logout",
                "/action/**"
            ).authenticated()
            .anyRequest().authenticated();

        http.csrf().requireCsrfProtectionMatcher((HttpServletRequest req) -> {
            // Disable for SAML
            if (this.samlMatcher.matches(req)) {
                return false;
            }
            // Include all state-changing methods
            if (this.csrfMethods.matcher(req.getMethod()).matches()) {
                return true;
            }

            return false;
        });

        http.exceptionHandling().authenticationEntryPoint(this.authenticationEntryPoint());

        http.formLogin()
            .loginPage("/login")
            .failureUrl("/error/401")
            .defaultSuccessUrl("/logged-in", true)
            .usernameParameter("username")
            .passwordParameter("password");

        http.logout()
            .logoutUrl("/logout")
            .logoutSuccessUrl("/logged-out")
            .invalidateHttpSession(true)
            .clearAuthentication(true)
            .permitAll();

        http.addFilterBefore(this.metadataGeneratorFilter(), ChannelProcessingFilter.class);
        http.addFilterBefore(this.oauth2Filter(), BasicAuthenticationFilter.class);
        http.addFilterAfter(this.samlFilter(), BasicAuthenticationFilter.class);
        http.addFilterAfter(new MappedDiagnosticContextFilter(), SwitchUserFilter.class);
    }

    private Filter oauth2Filter() {
        final CompositeFilter filter = new CompositeFilter();
        final List<Filter> filters = new ArrayList<>();

        filters.add(this.oauth2Filter(this.google(), "/login/google"));
        filters.add(this.oauth2Filter(this.github(), "/login/github"));
        filters.add(this.oauth2Filter(this.helix(), "/login/helix"));
        filter.setFilters(filters);

        return filter;
    }

    private Filter oauth2Filter(ClientResources client, String path) {
        final OAuth2ClientAuthenticationProcessingFilter filter = new OAuth2ClientAuthenticationProcessingFilter(path);

        final OAuth2RestTemplate template = new OAuth2RestTemplate(client.getClient(), this.oauth2ClientContext);

        final OAuthUserInfoTokenServices tokenServices = new OAuthUserInfoTokenServices(
            client.getResource().getUserInfoUri(),
            client.getClient().getClientId(),
            this.userService,
            this.userInfoDetailResolver,
            this.accountRepository);

        tokenServices.setRestTemplate(template);

        filter.setRestTemplate(template);
        filter.setTokenServices(tokenServices);

        filter.setAuthenticationFailureHandler(this.oauth2FailureHandler());

        return filter;
    }

    @Bean
    @ConfigurationProperties("github")
    public ClientResources github() {
        return new ClientResources();
    }

    @Bean
    @ConfigurationProperties("google")
    public ClientResources google() {
        return new ClientResources();
    }

    @Bean
    @ConfigurationProperties("helix")
    public ClientResources helix() {
        return new ClientResources();
    }

    @Bean
    public FilterRegistrationBean<OAuth2ClientContextFilter> oauth2ClientFilterRegistration(OAuth2ClientContextFilter filter) {
        final FilterRegistrationBean<OAuth2ClientContextFilter> registration = new FilterRegistrationBean<OAuth2ClientContextFilter>();
        registration.setFilter(filter);
        registration.setOrder(-100);
        return registration;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder builder) throws Exception {
        builder.userDetailsService(this.userService).passwordEncoder(new BCryptPasswordEncoder());
        builder.eraseCredentials(true);

        builder.authenticationProvider(this.samlAuthenticationProvider());
    }

}
