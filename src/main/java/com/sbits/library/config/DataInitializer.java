package com.sbits.library.config;

import com.sbits.library.entity.Author;
import com.sbits.library.entity.Book;
import com.sbits.library.repository.AuthorRepository;
import com.sbits.library.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class to populate the database with 10 sample rows
 * in each table on application startup.
 */
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(AuthorRepository authorRepository, BookRepository bookRepository) {
        return args -> {
            // Create 10 Authors
            Author a1 = new Author("George Orwell", "george.orwell@email.com", "British");
            Author a2 = new Author("Jane Austen", "jane.austen@email.com", "British");
            Author a3 = new Author("Mark Twain", "mark.twain@email.com", "American");
            Author a4 = new Author("Leo Tolstoy", "leo.tolstoy@email.com", "Russian");
            Author a5 = new Author("Gabriel Garcia Marquez", "gabriel.marquez@email.com", "Colombian");
            Author a6 = new Author("Haruki Murakami", "haruki.murakami@email.com", "Japanese");
            Author a7 = new Author("Chinua Achebe", "chinua.achebe@email.com", "Nigerian");
            Author a8 = new Author("Franz Kafka", "franz.kafka@email.com", "Czech");
            Author a9 = new Author("Fyodor Dostoevsky", "fyodor.dostoevsky@email.com", "Russian");
            Author a10 = new Author("Toni Morrison", "toni.morrison@email.com", "American");

            authorRepository.save(a1);
            authorRepository.save(a2);
            authorRepository.save(a3);
            authorRepository.save(a4);
            authorRepository.save(a5);
            authorRepository.save(a6);
            authorRepository.save(a7);
            authorRepository.save(a8);
            authorRepository.save(a9);
            authorRepository.save(a10);

            // Create 10 Books (assigned to various authors)
            bookRepository.save(new Book("1984", "978-0451524935", "Dystopian", 9.99, a1));
            bookRepository.save(new Book("Animal Farm", "978-0451526342", "Satire", 7.99, a1));
            bookRepository.save(new Book("Pride and Prejudice", "978-0141439518", "Romance", 6.99, a2));
            bookRepository.save(new Book("Adventures of Huckleberry Finn", "978-0486280615", "Adventure", 5.99, a3));
            bookRepository.save(new Book("War and Peace", "978-0199232765", "Historical Fiction", 12.99, a4));
            bookRepository.save(new Book("One Hundred Years of Solitude", "978-0060883287", "Magical Realism", 11.99, a5));
            bookRepository.save(new Book("Norwegian Wood", "978-0375704024", "Literary Fiction", 10.99, a6));
            bookRepository.save(new Book("Things Fall Apart", "978-0385474542", "Literary Fiction", 8.99, a7));
            bookRepository.save(new Book("The Metamorphosis", "978-0486290300", "Absurdist Fiction", 4.99, a8));
            bookRepository.save(new Book("Crime and Punishment", "978-0486415871", "Psychological Fiction", 6.99, a9));

            System.out.println("=== Database populated with 10 Authors and 10 Books ===");
        };
    }
}
