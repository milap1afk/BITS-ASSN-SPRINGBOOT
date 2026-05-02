package com.sbits.library.repository;

import com.sbits.library.entity.Author;
import com.sbits.library.entity.Book;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for BookRepository using @DataJpaTest (in-memory H2).
 */
@DataJpaTest
class BookRepositoryTest {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private AuthorRepository authorRepository;

    private Author sampleAuthor;
    private Book sampleBook;

    @BeforeEach
    void setUp() {
        bookRepository.deleteAll();
        authorRepository.deleteAll();
        sampleAuthor = authorRepository.save(new Author("Test Author", "test@email.com", "British"));
        sampleBook = bookRepository.save(new Book("Test Book", "978-0000000001", "Fiction", 9.99, sampleAuthor));
    }

    @Test
    void testSaveBook() {
        Book book = new Book("New Book", "978-0000000002", "Sci-Fi", 12.99, sampleAuthor);
        Book saved = bookRepository.save(book);
        assertNotNull(saved.getId());
        assertEquals("New Book", saved.getTitle());
    }

    @Test
    void testFindById() {
        Optional<Book> found = bookRepository.findById(sampleBook.getId());
        assertTrue(found.isPresent());
        assertEquals("Test Book", found.get().getTitle());
    }

    @Test
    void testFindAll() {
        bookRepository.save(new Book("Book 2", "978-0000000003", "Drama", 7.99, sampleAuthor));
        List<Book> books = bookRepository.findAll();
        assertEquals(2, books.size());
    }

    @Test
    void testFindByGenre() {
        bookRepository.save(new Book("Fiction Book 2", "978-0000000004", "Fiction", 8.99, sampleAuthor));
        List<Book> fictionBooks = bookRepository.findByGenre("Fiction");
        assertEquals(2, fictionBooks.size());
    }

    @Test
    void testFindByAuthorId() {
        List<Book> books = bookRepository.findByAuthorId(sampleAuthor.getId());
        assertEquals(1, books.size());
        assertEquals("Test Book", books.get(0).getTitle());
    }

    @Test
    void testUpdateBook() {
        sampleBook.setTitle("Updated Title");
        sampleBook.setPrice(19.99);
        Book updated = bookRepository.save(sampleBook);
        assertEquals("Updated Title", updated.getTitle());
        assertEquals(19.99, updated.getPrice());
    }

    @Test
    void testFindBooksWithAuthors() {
        List<Object[]> results = bookRepository.findBooksWithAuthors();
        assertFalse(results.isEmpty());
        Object[] row = results.get(0);
        assertTrue(row[0] instanceof Book);
        assertTrue(row[1] instanceof Author);
    }
}
