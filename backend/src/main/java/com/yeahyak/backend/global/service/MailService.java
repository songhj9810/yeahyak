package com.yeahyak.backend.global.service;

import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public void sendInvitationMail(String to, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("[YEAHYAK] 회원가입 초대 메일");
            message.setText("아래 링크를 클릭하면 회원가입 페이지로 이동합니다.\n" + frontendUrl + "/signup?token=" + token);
            mailSender.send(message);
        } catch (MailException e) {
            throw new CustomException(ErrorCode.SERVICE_UNAVAILABLE);
        }
    }

    public void sendPasswordResetMail(String to, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("[YEAHYAK] 비밀번호 재설정 메일");
            message.setText("아래 링크를 클릭하면 비밀번호 재설정 페이지로 이동합니다.\n" + frontendUrl + "/reset-password?token=" + token);
            mailSender.send(message);
        } catch (MailException e) {
            throw new CustomException(ErrorCode.SERVICE_UNAVAILABLE);
        }
    }
}
