package com.example.blog.controller;

import lombok.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {
    @org.springframework.beans.factory.annotation.Value("${app.upload.dir:uploads}")   // thư mục lưu file (mặc định ./uploads)
    private String uploadDir;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> upload(@RequestParam("file") MultipartFile file)
            throws IOException {

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File rỗng");
        }

        String contentType = Optional.ofNullable(file.getContentType()).orElse("");
        if (!contentType.startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ cho phép ảnh");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Tối đa 5MB");
        }

        // đảm bảo thư mục tồn tại
        Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(dir);

        // lấy và kiểm tra đuôi file
        String original = Optional.ofNullable(file.getOriginalFilename()).orElse("image");
        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0) ext = original.substring(dot + 1).toLowerCase(Locale.ROOT);

        Set<String> allowed = Set.of("jpg","jpeg","png","gif","webp");
        if (!ext.isEmpty() && !allowed.contains(ext)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Định dạng không hỗ trợ");
        }

        // tên file ngẫu nhiên
        String filename = UUID.randomUUID().toString().replace("-", "") + (ext.isEmpty() ? ".png" : "." + ext);
        Path dest = dir.resolve(filename);
        try (var in = file.getInputStream()) {
            Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
        }

        // tạo URL công khai
        String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/").path(filename).toUriString();

        return ResponseEntity
                .created(URI.create(url)) // 201 + Location
                .body(Map.of("url", url, "filename", filename));
    }
}