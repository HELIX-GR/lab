package gr.helix.lab.web;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(
    properties = {
        "spring.profiles.active=testing",
        "spring.main.allow-bean-definition-overriding=true"
    }
)
public class ApplicationTests
{

    @Test
    public void contextLoads() throws Exception
    {
    }

}