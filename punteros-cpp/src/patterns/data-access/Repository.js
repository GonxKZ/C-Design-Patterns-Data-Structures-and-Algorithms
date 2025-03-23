const repositoryPattern = {
  id: 'repository',
  name: 'Repository',
  category: 'data-access',
  description: 'Encapsula la lógica para acceder a los datos y provee una abstracción de las fuentes de datos a los clientes.',
  
  theory: {
    background: 'El patrón Repository se originó en el contexto de Domain-Driven Design (DDD) como una forma de separar el dominio de negocio de los detalles de persistencia.',
    problem: 'Al interactuar directamente con la capa de datos, el código de negocio se mezcla con la lógica de acceso a datos, creando un acoplamiento fuerte. Los cambios en una capa afectan a la otra, dificultando pruebas y mantenimiento.',
    solution: 'El patrón Repository actúa como un mediador entre el dominio y las capas de mapeo de datos, usando una interfaz similar a una colección para acceder a los objetos del dominio.',
    applicability: [
      'Cuando se quiere aislar el código de negocio de la lógica de acceso a datos',
      'Para mejorar la testabilidad usando repositorios simulados en pruebas',
      'Para centralizar la lógica de consulta y manipulación de datos',
      'Cuando se necesita una capa de abstracción sobre diversas fuentes de datos'
    ],
    consequences: [
      'Mejora la separación de responsabilidades',
      'Facilita las pruebas unitarias mediante mocks',
      'Centraliza la lógica de acceso a datos',
      'Reduce la duplicación de código',
      'Puede añadir complejidad para aplicaciones simples'
    ]
  },
  
  implementations: {
    cppTraditional: {
      code: `// Entidad de dominio
class User {
private:
    int id;
    std::string name;
    std::string email;

public:
    User(int id, const std::string& name, const std::string& email)
        : id(id), name(name), email(email) {}
    
    int getId() const { return id; }
    std::string getName() const { return name; }
    std::string getEmail() const { return email; }
    
    void setName(const std::string& newName) { name = newName; }
    void setEmail(const std::string& newEmail) { email = newEmail; }
};

// Interfaz del repositorio
class UserRepository {
public:
    virtual ~UserRepository() {}
    
    virtual User* findById(int id) = 0;
    virtual std::vector<User*> findAll() = 0;
    virtual void save(User* user) = 0;
    virtual void remove(int id) = 0;
};

// Implementación del repositorio usando una base de datos
class SqlUserRepository : public UserRepository {
private:
    // Simulación de conexión a base de datos
    class DbConnection {
    public:
        void execute(const std::string& sql) {
            std::cout << "Ejecutando SQL: " << sql << std::endl;
        }
        
        User* querySingleUser(const std::string& sql) {
            std::cout << "Ejecutando consulta para un usuario: " << sql << std::endl;
            // Simulamos que obtenemos un usuario de la BD
            return new User(1, "John Doe", "john@example.com");
        }
        
        std::vector<User*> queryMultipleUsers(const std::string& sql) {
            std::cout << "Ejecutando consulta para múltiples usuarios: " << sql << std::endl;
            std::vector<User*> users;
            // Simulamos que obtenemos usuarios de la BD
            users.push_back(new User(1, "John Doe", "john@example.com"));
            users.push_back(new User(2, "Jane Smith", "jane@example.com"));
            return users;
        }
    };
    
    DbConnection connection;

public:
    User* findById(int id) override {
        std::string sql = "SELECT * FROM users WHERE id = " + std::to_string(id);
        return connection.querySingleUser(sql);
    }
    
    std::vector<User*> findAll() override {
        std::string sql = "SELECT * FROM users";
        return connection.queryMultipleUsers(sql);
    }
    
    void save(User* user) override {
        if (user->getId() == 0) {
            // Nuevo usuario - INSERT
            std::string sql = "INSERT INTO users (name, email) VALUES ('" + 
                user->getName() + "', '" + user->getEmail() + "')";
            connection.execute(sql);
        } else {
            // Usuario existente - UPDATE
            std::string sql = "UPDATE users SET name = '" + user->getName() + 
                "', email = '" + user->getEmail() + "' WHERE id = " + 
                std::to_string(user->getId());
            connection.execute(sql);
        }
    }
    
    void remove(int id) override {
        std::string sql = "DELETE FROM users WHERE id = " + std::to_string(id);
        connection.execute(sql);
    }
};

// Implementación de un repositorio en memoria para pruebas
class InMemoryUserRepository : public UserRepository {
private:
    std::map<int, User*> users;
    int nextId = 1;

public:
    ~InMemoryUserRepository() {
        for (auto& pair : users) {
            delete pair.second;
        }
    }
    
    User* findById(int id) override {
        auto it = users.find(id);
        if (it != users.end()) {
            return it->second;
        }
        return nullptr;
    }
    
    std::vector<User*> findAll() override {
        std::vector<User*> result;
        for (auto& pair : users) {
            result.push_back(pair.second);
        }
        return result;
    }
    
    void save(User* user) override {
        if (user->getId() == 0) {
            // Nuevo usuario - asignar ID
            // En una aplicación real, clonaríamos el usuario
            User* newUser = new User(nextId++, user->getName(), user->getEmail());
            users[newUser->getId()] = newUser;
        } else {
            // Usuario existente
            users[user->getId()] = user;
        }
    }
    
    void remove(int id) override {
        auto it = users.find(id);
        if (it != users.end()) {
            delete it->second;
            users.erase(it);
        }
    }
};

// Servicio que usa el repositorio
class UserService {
private:
    UserRepository* repository;

public:
    UserService(UserRepository* repository) : repository(repository) {}
    
    User* getUserById(int id) {
        return repository->findById(id);
    }
    
    std::vector<User*> getAllUsers() {
        return repository->findAll();
    }
    
    void createUser(const std::string& name, const std::string& email) {
        User* user = new User(0, name, email);
        repository->save(user);
    }
    
    void updateUser(int id, const std::string& name, const std::string& email) {
        User* user = repository->findById(id);
        if (user) {
            user->setName(name);
            user->setEmail(email);
            repository->save(user);
        }
    }
    
    void deleteUser(int id) {
        repository->remove(id);
    }
};

// Código cliente
void clientCode() {
    // Con repositorio SQL
    UserRepository* sqlRepo = new SqlUserRepository();
    UserService sqlService(sqlRepo);
    
    sqlService.createUser("Alice Brown", "alice@example.com");
    User* user = sqlService.getUserById(1);
    if (user) {
        std::cout << "Usuario: " << user->getName() << ", " << user->getEmail() << std::endl;
    }
    
    // Con repositorio en memoria (por ejemplo, para pruebas)
    UserRepository* inMemoryRepo = new InMemoryUserRepository();
    UserService testService(inMemoryRepo);
    
    testService.createUser("Bob Green", "bob@example.com");
    std::vector<User*> users = testService.getAllUsers();
    for (User* u : users) {
        std::cout << "Usuario en memoria: " << u->getName() << std::endl;
    }
    
    // Limpieza
    delete sqlRepo;
    delete inMemoryRepo;
}`,
      explanation: [
        { line: 1, text: "Definimos la entidad User del dominio que representa los datos que manejaremos." },
        { line: 18, text: "Interfaz del repositorio que define operaciones CRUD para la entidad User." },
        { line: 28, text: "Implementación del repositorio usando una base de datos SQL." },
        { line: 30, text: "Simulamos una conexión a base de datos para demostrar el patrón." },
        { line: 59, text: "Métodos que implementan las operaciones CRUD definidas en la interfaz." },
        { line: 91, text: "Implementación alternativa del repositorio que almacena los datos en memoria." },
        { line: 134, text: "Servicio que usa el repositorio para implementar la lógica de negocio." },
        { line: 165, text: "Código cliente que muestra cómo usar los repositorios con el servicio." },
        { line: 168, text: "Creamos un repositorio SQL y un servicio que lo utiliza." },
        { line: 176, text: "Creamos un repositorio en memoria, útil para pruebas unitarias." }
      ]
    },
    cppModern: {
      code: `// Entidad de dominio
class User {
private:
    int id;
    std::string name;
    std::string email;

public:
    User(int id, std::string name, std::string email)
        : id(id), name(std::move(name)), email(std::move(email)) {}
    
    int getId() const { return id; }
    const std::string& getName() const { return name; }
    const std::string& getEmail() const { return email; }
    
    void setName(std::string newName) { name = std::move(newName); }
    void setEmail(std::string newEmail) { email = std::move(newEmail); }
};

// Interfaz del repositorio con smart pointers
class UserRepository {
public:
    virtual ~UserRepository() = default;
    
    virtual std::optional<User> findById(int id) = 0;
    virtual std::vector<User> findAll() = 0;
    virtual void save(const User& user) = 0;
    virtual bool remove(int id) = 0;
};

// Implementación del repositorio usando una base de datos
class SqlUserRepository : public UserRepository {
private:
    // Simulación de conexión a base de datos
    class DbConnection {
    public:
        void execute(const std::string& sql) {
            std::cout << "Ejecutando SQL: " << sql << std::endl;
        }
        
        std::optional<User> querySingleUser(const std::string& sql) {
            std::cout << "Ejecutando consulta para un usuario: " << sql << std::endl;
            // Simulamos que obtenemos un usuario de la BD
            return User{1, "John Doe", "john@example.com"};
        }
        
        std::vector<User> queryMultipleUsers(const std::string& sql) {
            std::cout << "Ejecutando consulta para múltiples usuarios: " << sql << std::endl;
            std::vector<User> users;
            // Simulamos que obtenemos usuarios de la BD
            users.emplace_back(1, "John Doe", "john@example.com");
            users.emplace_back(2, "Jane Smith", "jane@example.com");
            return users;
        }
    };
    
    DbConnection connection;

public:
    std::optional<User> findById(int id) override {
        std::string sql = "SELECT * FROM users WHERE id = " + std::to_string(id);
        return connection.querySingleUser(sql);
    }
    
    std::vector<User> findAll() override {
        std::string sql = "SELECT * FROM users";
        return connection.queryMultipleUsers(sql);
    }
    
    void save(const User& user) override {
        if (user.getId() == 0) {
            // Nuevo usuario - INSERT
            std::string sql = "INSERT INTO users (name, email) VALUES ('" + 
                user.getName() + "', '" + user.getEmail() + "')";
            connection.execute(sql);
        } else {
            // Usuario existente - UPDATE
            std::string sql = "UPDATE users SET name = '" + user.getName() + 
                "', email = '" + user.getEmail() + "' WHERE id = " + 
                std::to_string(user.getId());
            connection.execute(sql);
        }
    }
    
    bool remove(int id) override {
        std::string sql = "DELETE FROM users WHERE id = " + std::to_string(id);
        connection.execute(sql);
        return true; // Asumimos éxito para simplificar
    }
};

// Implementación de un repositorio en memoria para pruebas
class InMemoryUserRepository : public UserRepository {
private:
    std::unordered_map<int, User> users;
    int nextId = 1;

public:
    std::optional<User> findById(int id) override {
        auto it = users.find(id);
        if (it != users.end()) {
            return it->second;
        }
        return std::nullopt;
    }
    
    std::vector<User> findAll() override {
        std::vector<User> result;
        result.reserve(users.size());
        for (const auto& [_, user] : users) {
            result.push_back(user);
        }
        return result;
    }
    
    void save(const User& user) override {
        if (user.getId() == 0) {
            // Nuevo usuario - asignar ID
            User newUser{nextId++, user.getName(), user.getEmail()};
            users[newUser.getId()] = std::move(newUser);
        } else {
            // Usuario existente
            users[user.getId()] = user;
        }
    }
    
    bool remove(int id) override {
        return users.erase(id) > 0;
    }
};

// Servicio que usa el repositorio
class UserService {
private:
    std::shared_ptr<UserRepository> repository;

public:
    explicit UserService(std::shared_ptr<UserRepository> repo) 
        : repository(std::move(repo)) {}
    
    std::optional<User> getUserById(int id) {
        return repository->findById(id);
    }
    
    std::vector<User> getAllUsers() {
        return repository->findAll();
    }
    
    void createUser(const std::string& name, const std::string& email) {
        User user{0, name, email};
        repository->save(user);
    }
    
    void updateUser(int id, const std::string& name, const std::string& email) {
        auto userOpt = repository->findById(id);
        if (userOpt) {
            User user = *userOpt;
            user.setName(name);
            user.setEmail(email);
            repository->save(user);
        }
    }
    
    bool deleteUser(int id) {
        return repository->remove(id);
    }
};

// Código cliente
void clientCode() {
    // Con repositorio SQL
    auto sqlRepo = std::make_shared<SqlUserRepository>();
    UserService sqlService(sqlRepo);
    
    sqlService.createUser("Alice Brown", "alice@example.com");
    auto userOpt = sqlService.getUserById(1);
    if (userOpt) {
        const auto& user = *userOpt;
        std::cout << "Usuario: " << user.getName() << ", " << user.getEmail() << std::endl;
    }
    
    // Con repositorio en memoria (por ejemplo, para pruebas)
    auto inMemoryRepo = std::make_shared<InMemoryUserRepository>();
    UserService testService(inMemoryRepo);
    
    testService.createUser("Bob Green", "bob@example.com");
    auto users = testService.getAllUsers();
    for (const auto& u : users) {
        std::cout << "Usuario en memoria: " << u.getName() << std::endl;
    }
}`,
      explanation: [
        { line: 1, text: "Definimos la entidad User con constructores que usan std::move para optimizar asignaciones." },
        { line: 18, text: "Interfaz del repositorio que usa std::optional para valores posiblemente nulos." },
        { line: 27, text: "Implementación SQL del repositorio que utiliza tipos modernos como std::optional." },
        { line: 55, text: "El método findById devuelve un std::optional<User> en vez de un puntero, evitando null checks." },
        { line: 82, text: "Implementación en memoria que usa std::unordered_map para almacenamiento eficiente." },
        { line: 89, text: "Retornamos std::nullopt cuando no encontramos un usuario, más seguro que nullptr." },
        { line: 96, text: "Usamos destructuring con auto [_, user] para iterar el mapa (C++17)." },
        { line: 123, text: "Servicio que usa std::shared_ptr para gestionar la memoria del repositorio." },
        { line: 126, text: "Constructor con std::move para transferir eficientemente la propiedad del repositorio." },
        { line: 153, text: "Código cliente que utiliza std::make_shared para crear los repositorios." }
      ]
    },
    java: {
      code: `// Entidad de dominio
public class User {
    private final Long id;
    private String name;
    private String email;
    
    public User(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
}

// Interfaz del repositorio
public interface UserRepository {
    Optional<User> findById(Long id);
    List<User> findAll();
    User save(User user);
    void delete(Long id);
}

// Implementación del repositorio con JPA
@Repository
public class JpaUserRepository implements UserRepository {
    
    private final EntityManager entityManager;
    
    @Autowired
    public JpaUserRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
    
    @Override
    public Optional<User> findById(Long id) {
        User user = entityManager.find(User.class, id);
        return Optional.ofNullable(user);
    }
    
    @Override
    public List<User> findAll() {
        return entityManager.createQuery("SELECT u FROM User u", User.class).getResultList();
    }
    
    @Override
    public User save(User user) {
        if (user.getId() == null) {
            // Nuevo usuario
            entityManager.persist(user);
            return user;
        } else {
            // Usuario existente
            return entityManager.merge(user);
        }
    }
    
    @Override
    public void delete(Long id) {
        User user = entityManager.find(User.class, id);
        if (user != null) {
            entityManager.remove(user);
        }
    }
}

// Implementación en memoria para pruebas
public class InMemoryUserRepository implements UserRepository {
    
    private final Map<Long, User> users = new HashMap<>();
    private long nextId = 1L;
    
    @Override
    public Optional<User> findById(Long id) {
        return Optional.ofNullable(users.get(id));
    }
    
    @Override
    public List<User> findAll() {
        return new ArrayList<>(users.values());
    }
    
    @Override
    public User save(User user) {
        if (user.getId() == null) {
            // Nuevo usuario - crear copia con ID asignado
            User newUser = new User(nextId++, user.getName(), user.getEmail());
            users.put(newUser.getId(), newUser);
            return newUser;
        } else {
            // Usuario existente
            users.put(user.getId(), user);
            return user;
        }
    }
    
    @Override
    public void delete(Long id) {
        users.remove(id);
    }
}

// Servicio que usa el repositorio
@Service
public class UserService {
    
    private final UserRepository userRepository;
    
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User createUser(String name, String email) {
        User user = new User(null, name, email);
        return userRepository.save(user);
    }
    
    public Optional<User> updateUser(Long id, String name, String email) {
        return userRepository.findById(id)
            .map(user -> {
                user.setName(name);
                user.setEmail(email);
                return userRepository.save(user);
            });
    }
    
    public void deleteUser(Long id) {
        userRepository.delete(id);
    }
}

// Uso en una aplicación Spring
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;
    
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
            .map(user -> ResponseEntity.ok(user))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserDTO userDTO) {
        User user = userService.createUser(userDTO.getName(), userDTO.getEmail());
        return ResponseEntity.created(URI.create("/api/users/" + user.getId())).body(user);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        return userService.updateUser(id, userDTO.getName(), userDTO.getEmail())
            .map(user -> ResponseEntity.ok(user))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}`,
      explanation: [
        { line: 1, text: "Definimos la entidad User que representa los datos que gestionará el repositorio." },
        { line: 19, text: "Interfaz del repositorio con métodos CRUD que utiliza Optional<> para valores posiblemente nulos." },
        { line: 27, text: "Implementación del repositorio usando JPA (Java Persistence API) con anotaciones de Spring." },
        { line: 39, text: "El método findById devuelve un Optional para tratar de forma segura los resultados nulos." },
        { line: 50, text: "El método save maneja tanto la inserción como la actualización." },
        { line: 65, text: "Implementación en memoria para pruebas usando un HashMap como almacenamiento." },
        { line: 98, text: "Servicio que encapsula la lógica de negocio e inyecta el repositorio vía constructor." },
        { line: 122, text: "El método updateUser usa programación funcional con Optional.map()." },
        { line: 135, text: "Controlador REST que expone la funcionalidad del servicio como API web." },
        { line: 143, text: "Método para obtener un usuario por ID, usando ResponseEntity para gestionar la respuesta HTTP." }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Manejo de nulos',
      cppTraditional: 'Usa punteros (raw pointers) que pueden ser null, requiriendo verificación manual.',
      cppModern: 'Usa std::optional para valores posiblemente nulos, evitando problemas de referencias nulas.',
      java: 'Usa la clase Optional<T> para expresar valores posiblemente ausentes de forma segura.'
    },
    {
      title: 'Gestión de recursos',
      cppTraditional: 'Requiere gestión manual de memoria con new y delete, propenso a fugas de memoria.',
      cppModern: 'Usa smart pointers y value semantics para gestión automática de recursos.',
      java: 'La gestión de memoria es automática gracias al recolector de basura.'
    },
    {
      title: 'Persistencia',
      cppTraditional: 'Implementación manual de la persistencia sin frameworks estándar.',
      cppModern: 'Similar al tradicional pero con mejor sintaxis. Bibliotecas como ODB pueden facilitar el ORM.',
      java: 'Frameworks estándar como JPA/Hibernate proporcionan mapeo objeto-relacional robusto.'
    },
    {
      title: 'Integración en frameworks',
      cppTraditional: 'Generalmente requiere integración manual.',
      cppModern: 'Mejor soporte en bibliotecas modernas pero aún menos integrado que Java.',
      java: 'Integración directa con frameworks como Spring que proporcionan inyección de dependencias y anotaciones @Repository.'
    }
  ],
  
  notes: 'El patrón Repository es fundamental en aplicaciones empresariales para separar la lógica de negocio de los detalles de acceso a datos. Es especialmente útil en arquitecturas en capas y en Domain-Driven Design (DDD). En Java, Spring Data amplía este patrón proporcionando implementaciones automáticas de repositorios basados en interfaces. En C++, aunque no hay frameworks estándar equivalentes, se puede implementar manualmente siguiendo los mismos principios. Para aplicaciones grandes, considere combinar este patrón con Unit of Work para gestionar transacciones.'
};

export default repositoryPattern; 