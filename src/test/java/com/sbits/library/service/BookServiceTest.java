package com.sbits.library.service;

import com.sbits.library.entity.Author;
import com.sbits.library.entity.Book;
import com.sbits.library.repository.AuthorRepository;
import com.sbits.library.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for BookService using Mockito.
 */
@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private AuthorRepository authorRepository;

    @InjectMocks
    private BookService bookService;

    private Author sampleAuthor;
    private Book sampleBook;

    @BeforeEach
    void setUp() {
        sampleAuthor = new Author("Test Author", "test@email.com", "British");
        sampleAuthor.setId(1L);
        sampleBook = new Book("Test Book", "978-0000000001", "Fiction", 9.99, sampleAuthor);
        sampleBook.setId(1L);
    }

    @Test
    void testGetAllBooks() {
        when(bookRepository.findAll()).thenReturn(Arrays.asList(sampleBook));
        List<Book> result = bookService.getAllBooks();
        assertEquals(1, result.size());
        verify(bookRepository).findAll();
    }

    @Test
    void testGetBookById() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(sampleBook));
        Optional<Book> result = bookService.getBookById(1L);
        assertTrue(result.isPresent());
        assertEquals("Test Book", result.get().getTitle());
    }

    @Test
    void testSaveBook() {
        when(authorRepository.findById(1L)).thenReturn(Optional.of(sampleAuthor));
        when(bookRepository.save(any(Book.class))).thenReturn(sampleBook);
        Book result = bookService.saveBook(sampleBook, 1L);
        assertNotNull(result);
        assertEquals("Test Book", result.getTitle());
    }

    @Test
    void testSaveBookAuthorNotFound() {
        when(authorRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class,
                () -> bookService.saveBook(sampleBook, 99L));
    }

    @Test
    void testSaveBookDuplicateIsbn() {
        when(authorRepository.findById(1L)).thenReturn(Optional.of(sampleAuthor));
        when(bookRepository.save(any(Book.class)))
                .thenThrow(new DataIntegrityViolationException("Duplicate ISBN"));
        assertThrows(DataIntegrityViolationException.class,
                () -> bookService.saveBook(sampleBook, 1L));
    }

    @Test
    void testUpdateBook() {
        Book updated = new Book("Updated", "978-9999", "Drama", 15.99, sampleAuthor);
        when(bookRepository.findById(1L)).thenReturn(Optional.of(sampleBook));
        when(authorRepository.findById(1L)).thenReturn(Optional.of(sampleAuthor));
        when(bookRepository.save(any(Book.class))).thenReturn(sampleBook);
        Book result = bookService.updateBook(1L, updated, 1L);
        assertEquals("Updated", sampleBook.getTitle());
        verify(bookRepository).save(sampleBook);
    }

    @Test
    void testUpdateBookNotFound() {
        when(bookRepository.findById(99L)).thenReturn(Optional.empty());
        Book updated = new Book("X", "Y", "Z", 1.0, sampleAuthor);
        assertThrows(RuntimeException.class,
                () -> bookService.updateBook(99L, updated, 1L));
    }

    @Test
    void testGetBooksWithAuthors() {
        when(bookRepository.findBooksWithAuthors()).thenReturn(List.of());
        List<Object[]> result = bookService.getBooksWithAuthors();
        assertNotNull(result);
        verify(bookRepository).findBooksWithAuthors();
    }
}
