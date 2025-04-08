package com.gymTracker.GymTracker.App.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class Basic {
    // this is a controller class for
    // this is a method for hello world to get request for the method
//    @RequestMapping(value = "/", method = RequestMethod.GET)
//    public String helloWorld() {
//        return "Welcome to my Spring boot ";
//    }
        // it is better to use this
        @GetMapping("/")
        public String helloWorld() {
            return "Welcome to my Spring boot ";
        }
}

