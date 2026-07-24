package com.learnflow.service;

import com.learnflow.exception.CustomExceptions;
import com.learnflow.model.Cart;
import com.learnflow.model.Course;
import com.learnflow.model.User;
import com.learnflow.repository.CartRepository;
import com.learnflow.repository.CourseRepository;
import com.learnflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            CourseRepository courseRepository,
            UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> getCartDetails(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().userId(user.getId()).build()));

        List<Course> courses = courseRepository.findAllById(cart.getCourseIds());
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", cart.getId());
        response.put("userId", cart.getUserId());
        response.put("courses", courses);
        return response;
    }

    public void addToCart(String courseId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));
        courseRepository.findById(courseId)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Course not found"));

        if (user.getEnrolledCourses().contains(courseId)) {
            throw new CustomExceptions.BadRequestException("You are already enrolled in this course");
        }

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().userId(user.getId()).build()));

        if (!cart.getCourseIds().contains(courseId)) {
            cart.getCourseIds().add(courseId);
            cartRepository.save(cart);
        }
    }

    public void removeFromCart(String courseId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().userId(user.getId()).build()));

        if (cart.getCourseIds().contains(courseId)) {
            cart.getCourseIds().remove(courseId);
            cartRepository.save(cart);
        }
    }
}
