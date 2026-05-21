package com.gymTracker.GymTracker.Infracstructure.Utils;

import com.gymTracker.GymTracker.App.Controller.AppController;
import com.gymTracker.GymTracker.Domain.Constants.MailType;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.File;
import java.util.Map;

@Configuration
public class SendMails {

    @Value("${mail.sender}")
    private String mailFrom;

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public SendMails(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }
    public String sendEmail(MailType type, String recipientEmail, Map<String, Object> variables) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailFrom == null ? null : mailFrom.trim());
            helper.setTo(recipientEmail == null ? null : recipientEmail.trim());
            helper.setSubject(type.getSubject());

            // Select the template name based on mail type
            String templateName = getTemplateNameForType(type);

            // Set template context variables
            Context context = new Context();
            context.setVariables(variables);

            // Process the template with the variables
            String htmlContent = templateEngine.process(templateName, context);
            helper.setText(htmlContent, true);

            File inlineImage = new File("src/main/resources/static/app/union.png");
            if (inlineImage.exists()) {
                helper.addInline("union.png", inlineImage);
            }

            mailSender.send(message);
            return "Success";

        } catch (Exception e) {
            System.err.println("Failed to send mail: " + e.getMessage());
            return e.getMessage();
        }
    }
    private String getTemplateNameForType(MailType type) {
        return switch (type) {
            case SESSION_REGISTRATION -> "Registration";
            case SESSION_BOOKING -> "Booking";
            case SESSION_EDITED -> "SessionEdit";
            case SESSION_DELETION -> "SessionDelete";
            case WORKOUT -> "Workout";
            default -> "DefaultTemplate";
        };
    }



//    public String sendEmail(MailType type, String recipientEmail, Map<String, Object> variables){
//        try {
//            MimeMessage message = mailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
//
//            helper.setFrom(mailFrom);
//            helper.setTo(recipientEmail);
//            helper.setSubject(type.getSubject());
//
//
//            if (type.equals(MailType.SESSION_REGISTRATION)) {
//                try (var inputStream = Objects.requireNonNull(AppController.class.getResourceAsStream("/templates/Registration.html"))) {
//                    helper.setText(
//                            new String(inputStream.readAllBytes(), StandardCharsets.UTF_8), true
//                    );
//                }
//            }
//            if (type.equals(MailType.SESSION_BOOKING)) {
//                try (var inputStream = Objects.requireNonNull(AppController.class.getResourceAsStream("/templates/Booking.html"))) {
//                    helper.setText(
//                            new String(inputStream.readAllBytes(), StandardCharsets.UTF_8), true
//                    );
//                }
//            }
//            if (type.equals(MailType.SESSION_EDITED)) {
//                try (var inputStream = Objects.requireNonNull(AppController.class.getResourceAsStream("/templates/SessionEdit.html"))) {
//                    helper.setText(
//                            new String(inputStream.readAllBytes(), StandardCharsets.UTF_8), true
//                    );
//                }
//            }
//            if (type.equals(MailType.SESSION_DELETION)) {
//                try (var inputStream = Objects.requireNonNull(AppController.class.getResourceAsStream("/templates/SessionDelete.html"))) {
//                    helper.setText(
//                            new String(inputStream.readAllBytes(), StandardCharsets.UTF_8), true
//                    );
//                }
//            }
//
//            helper.addInline("union.png", new File("C:\\Users\\AbdulBasit\\Pictures\\union.png"));
//
//            mailSender.send(message);
//            return "Success";
//        } catch (Exception e) {
//            return e.getMessage();
//        }
//    }
}

/* -------- former way of getting email type (Just plain text)
try {
        String messageBody = null;
        if (type.equals(MailType.SESSION_REGISTRATION)) {
        messageBody =  mailRegister;
        }
        if (type.equals(MailType.SESSION_BOOKING)) {
        messageBody =  mailBooked;
        }
        if (type.equals(MailType.SESSION_REMINDER)) {
        messageBody =  mailReminder;
        }
        if (type.equals(MailType.SESSION_EDITED)) {
        messageBody =  mailEdited;
        }
        if (type.equals(MailType.SESSION_DELETION)) {
        messageBody =  mailDeleted;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(recipientEmail);
        message.setSubject(type.getSubject());
        message.setText(messageBody);

        mailSender.send(message);
        return "Success";
        }
        catch (Exception e){
        return e.getMessage();
        }
        }
*/