package com.learnflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class LearnFlowApplication {

	public static void main(String[] args) {
		SpringApplication.run(LearnFlowApplication.class, args);
	}

}
