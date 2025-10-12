package com.example.blog.service;

import com.example.blog.dto.Subscription;
import com.example.blog.model.Post;
import com.example.blog.repo.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class NotificationService {
    private final JavaMailSender mailSender;
    private final SubscriptionRepository subRepo;

    @Value("${app.mail.from}") private String from;
    @Value("${app.frontend.base-url}") private String feBase;

    public NotificationService(JavaMailSender mailSender, SubscriptionRepository subRepo) {
        this.mailSender = mailSender; this.subRepo = subRepo;
    }

    @Async
    public void sendNewPostEmails(Post post) {
        List<Subscription> subs = subRepo.findAll();
        if (subs.isEmpty()) return;

        String subject = "Bài mới: " + post.getTitle();
        for (Subscription s : subs) {
            try {
                String link = feBase + "/posts/" + post.getId();
                String unsub = feBase + "/unsubscribe?token=" + s.getToken();
                String html = """
          <div style="font-family:system-ui,Segoe UI,sans-serif">
            <h2 style="margin:0 0 8px">Bài viết mới trên LangBlog</h2>
            <p style="margin:0 0 8px"><b>%s</b></p>
            <p style="margin:0 0 12px">Danh mục: %s — Ngôn ngữ: %s</p>
            <p><a href="%s" style="background:#2563eb;color:#fff;padding:10px 14px;border-radius:10px;text-decoration:none">
              Đọc bài</a></p>
            <hr style="margin:20px 0;border:none;border-top:1px solid #e5e7eb"/>
            <p style="font-size:12px;color:#6b7280">Bạn nhận email vì đã đăng ký. 
              Hủy đăng ký <a href="%s">tại đây</a>.
            </p>
          </div>
        """.formatted(post.getTitle(),
                        post.getCategory()==null?"-":post.getCategory(),
                        post.getLanguage(), link, unsub);

                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                        StandardCharsets.UTF_8.name());
                helper.setFrom(from);
                helper.setTo(s.getEmail());
                helper.setSubject(subject);
                helper.setText(html, true);
                mailSender.send(message);
            } catch (Exception ignored) {}
        }
    }
}