package com.learnflow.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String to, String otp) {
        String subject = "Verify Your Email - LearnFlow";
        String htmlContent = "<h3>Welcome to LearnFlow!</h3>"
                + "<p>Please use the following One-Time Password (OTP) to complete your verification:</p>"
                + "<h2 style='color:#16a34a; letter-spacing:2px;'>" + otp + "</h2>"
                + "<p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>";

        sendHtmlEmail(to, subject, htmlContent);
    }

    public void sendPasswordResetEmail(String to, String otp) {
        String subject = "Reset Your Password - LearnFlow";
        String htmlContent = "<h3>LearnFlow Password Reset Request</h3>"
                + "<p>We received a request to reset your password. Use the OTP below to set a new password:</p>"
                + "<h2 style='color:#2563eb; letter-spacing:2px;'>" + otp + "</h2>"
                + "<p>This OTP is valid for 10 minutes. If you did not request a password reset, please secure your account.</p>";

        sendHtmlEmail(to, subject, htmlContent);
    }

    public void sendRejectionEmail(String to, String reason) {
        String subject = "Update on your Instructor Application - LearnFlow";
        String htmlContent = "<h3>Hello,</h3>"
                + "<p>Thank you for your interest in teaching at LearnFlow.</p>"
                + "<p>Unfortunately, your application to become an instructor has been rejected for the following reason:</p>"
                + "<blockquote style='border-left:4px solid #ef4444; padding-left:10px; color:#555;'>" + reason + "</blockquote>"
                + "<p>You are welcome to re-apply with corrected information in the future.</p>"
                + "<p>Best regards,<br/>LearnFlow Team</p>";

        sendHtmlEmail(to, subject, htmlContent);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email to " + to, e);
        }
    }
}
