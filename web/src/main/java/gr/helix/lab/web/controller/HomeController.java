package gr.helix.lab.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

    private static final String clientRoutes[] = {
        "/",
        "/admin/",
        "/course/",
        "/courses/",
        "/error/",
        "/filesystem/",
        "/main/",
        "/notebook/",
        "/results/",
    };

    @RequestMapping("*")
    public String index(HttpSession session, HttpServletRequest request) {
        // Prevent infinite redirects
        if (this.isClientRoute(request.getServletPath())) {
            return "index";
        }
        return "redirect:/main/";
    }

    @RequestMapping({
        "/admin/**",
        "/course/**",
        "/courses/**",
        "/error/**",
        "/main/**",
        "/notebook/**"
    })
    public String reactRoutes(HttpSession session, HttpServletRequest request) {
        return "index";
    }

    private boolean isClientRoute(String path) {
        for (final String value : clientRoutes) {
            if (path.toLowerCase().startsWith(value)) {
                return true;
            }
        }
        return false;
    }

}
