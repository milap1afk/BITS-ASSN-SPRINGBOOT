package com.sbits.library.repository;

import com.sbits.library.entity.Author;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for AuthorRepository using @DataJpaTest (in-memory H2).
 */
@DataJpaTest
class AuthorRepositoryTest {

    @Autowired
    private AuthorRepository authorRepository;

    private Author sampleAuthor;

    @BeforeEach
    void setUp() {
        authorRepository.deleteAll();
        sampleAuthor = new Author("Test Author", "test@email.com", "Indian");
        sampleAuthor = authorRepository.save(sampleAuthor);
    }

    @Test
    void testSaveAuthor() {
        Author author = new Author("New Author", "new@email.com", "American");
        Author saved = authorRepository.save(author);
        assertNotNull(saved.getId());
        assertEquals("New Author", saved.getName());
    }

    @Test
    void testFindById() {
        Optional<Author> found = authorRepository.findById(sampleAuthor.getId());
        assertTrue(found.isPresent());
        assertEquals("Test Author", found.get().getName());
    }

    @Test
    void testFindAll() {
        authorRepository.save(new Author("Another Author", "another@email.com", "British"));
        List<Author> authors = authorRepository.findAll();
        assertEquals(2, authors.size());
    }

    @Test
    void testFindByEmail() {
        Author found = authorRepository.findByEmail("test@email.com");
        assertNotNull(found);
        assertEquals("Test Author", found.getName());
    }

    @Test
    void testFindByNationality() {
        authorRepository.save(new Author("Indian Author 2", "indian2@email.com", "Indian"));
        List<Author> indianAuthors = authorRepository.findByNationality("Indian");
        assertEquals(2, indianAuthors.size());
    }

    @Test
    void testUpdateAuthor() {
        sampleAuthor.setName("Updated Name");
        Author updated = authorRepository.save(sampleAuthor);
        assertEquals("Updated Name", updated.getName());
    }

    @Test
    void testFindByEmailReturnsNullWhenNotFound() {
        Author found = authorRepository.findByEmail("nonexistent@email.com");
        assertNull(found);
    }
}
