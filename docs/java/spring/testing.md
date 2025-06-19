# Testing

## Unit Test
### Dependency
1. `spring-boot-starter-test`
2. `Mockito`

### Annotation
1. `@Mock`: Create a mock dependency.
2. `@Spy`: Use the real dependency.
3. `@InjectMocks`: Class under test.

### Sample Code
```java
@ExtendWith(MockitoExtension.class) // Enables Mockito annotations
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldFindUserByIdWhenUserExists() {
        // ...
    }
}
```

## Integration Test
### Dependency
1. `spring-boot-starter-test`
2. H2 in-memory database

### Sample Code
- Controller Test:
```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldCreateUser() throws Exception {
        // Arrange
        String userJson = "{\"name\":\"Alice\",\"email\":\"alice@example.com\"}";

        // Act & Assert
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Alice"))
                .andExpect(jsonPath("$.email").value("alice@example.com"));
    }
}
```