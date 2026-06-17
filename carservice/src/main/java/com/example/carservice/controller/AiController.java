// package com.example.carservice.controller;


// import com.example.carservice.dto.AiChatRequest;
// import com.example.carservice.service.AiService;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/ai")
// public class AiController {

//     private final AiService aiService;

//     public AiController(AiService aiService) {
//         this.aiService = aiService;
//     }

//     @PostMapping("/chat")
//     public ResponseEntity<String> chat(
//             @RequestBody AiChatRequest request
//     ){

//         return ResponseEntity.ok(
//                 aiService.chat(
//                         request.getMessage()
//                 )
//         );
//     }
// }

package com.example.carservice.controller;

import com.example.carservice.dto.AiChatRequest;
import com.example.carservice.dto.AiChatResponse; // Bổ sung import này
import com.example.carservice.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
// Thêm "/api" vào đường dẫn để khớp chính xác với lời gọi bên ReactJS
@RequestMapping("/api/ai") 
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody AiChatRequest request) {
        
        // 1. Lấy câu trả lời (dạng chuỗi) từ AiService
        String answer = aiService.chat(request.getMessage());
        
        // 2. Bọc chuỗi đó vào object AiChatResponse để nó tự động biến thành JSON: {"answer": "..."}
        return ResponseEntity.ok(new AiChatResponse(answer));
    }
}