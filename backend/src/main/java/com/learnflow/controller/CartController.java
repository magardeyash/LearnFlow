package com.learnflow.controller;

import com.learnflow.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCartDetails(Principal principal) {
        return ResponseEntity.ok(cartService.getCartDetails(principal.getName()));
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addToCart(@RequestBody Map<String, String> body, Principal principal) {
        String courseId = body.get("courseId");
        cartService.addToCart(courseId, principal.getName());
        return ResponseEntity.ok(Map.of("message", "Course added to cart successfully"));
    }

    @DeleteMapping("/remove/{courseId}")
    public ResponseEntity<Map<String, String>> removeFromCart(@PathVariable String courseId, Principal principal) {
        cartService.removeFromCart(courseId, principal.getName());
        return ResponseEntity.ok(Map.of("message", "Course removed from cart successfully"));
    }
}
