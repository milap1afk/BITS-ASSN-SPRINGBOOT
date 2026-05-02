package com.sbits.library.service;

import com.sbits.library.entity.Author;
import com.sbits.library.repository.AuthorRepository;
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
 * Unit tests for AuthorService using Mockito.
 */
@ExtendWith(MockitoExtension.class)
class AuthorServiceTest {

    @Mock
    private AuthorRepository authorRepository;

    @InjectMocks
    private AuthorService authorService;

    private Author sampleAuthor;

    @BeforeEach
    void setUp() {
        sampleAuthor = new Author("Test Author", "test@email.com", "Indian");
        sampleAuthor.setId(1L);
    }

    @Test
    void testGetAllAuthors() {
        Author a2 = new Author("Author 2", "a2@email.com", "British");
        when(authorRepository.findAll()).thenReturn(Arrays.asList(sampleAuthor, a2));
        List<Author> result = authorService.getAllAuthors();
        assertEquals(2, result.size());
        verify(authorRepository, times(1)).findAll();
    }

    @Test
    void testGetAuthorById() {
        when(authorRepository.findById(1L)).thenReturn(Optional.of(sampleAuthor));
        Optional<Author> result = authorService.getAuthorById(1L);
        assertTrue(result.isPresent());
        assertEquals("Test Author", result.get().getName());
    }

    @Test
    void testGetAuthorByIdNotFound() {
        when(authorRepository.findById(99L)).thenReturn(Optional.empty());
        Optional<Author> result = authorService.getAuthorById(99L);
        assertFalse(result.isPresent());
    }

    @Test
    void testSaveAuthor() {
        when(authorRepository.save(any(Author.class))).thenReturn(sampleAuthor);
        Author result = authorService.saveAuthor(sampleAuthor);
        assertNotNull(result);
        assertEquals("Test Author", result.getName());
        verify(authorRepository, times(1)).save(sampleAuthor);
    }

    @Test
    void testSaveAuthorDuplicateEmail() {
        when(authorRepository.save(any(Author.class)))
                .thenThrow(new DataIntegrityViolationException("Duplicate"));
        assertThrows(DataIntegrityViolationException.class,
                () -> authorService.saveAuthor(sampleAuthor));
    }

    @Test
    void testUpdateAuthor() {
        Author updated = new Author("Updated Name", "updated@email.com", "American");
        when(authorRepository.findById(1L)).thenReturn(Optional.of(sampleAuthor));
        when(authorRepository.save(any(Author.class))).thenReturn(sampleAuthor);
        Author result = authorService.updateAuthor(1L, updated);
        assertEquals("Updated Name", sampleAuthor.getName());
        verify(authorRepository).save(sampleAuthor);
    }

    @Test
    void testUpdateAuthorNotFound() {
        when(authorRepository.findById(99L)).thenReturn(Optional.empty());
        Author updated = new Author("Name", "e@e.com", "X");
        assertThrows(RuntimeException.class,
                () -> authorService.updateAuthor(99L, updated));
    }

    @Test
    void testGetAuthorsWithBooks() {
        when(authorRepository.findAuthorsWithBooks()).thenReturn(List.of());
        List<Object[]> result = authorService.getAuthorsWithBooks();
        assertNotNull(result);
        verify(authorRepository).findAuthorsWithBooks();
    }
}
