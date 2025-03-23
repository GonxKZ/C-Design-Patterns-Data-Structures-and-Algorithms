const facadePattern = {
  id: 'facade',
  name: 'Facade',
  category: 'structural',
  description: 'El patrón Facade proporciona una interfaz unificada y de alto nivel para un conjunto de interfaces en un subsistema. Define una interfaz de nivel superior que hace que el subsistema sea más fácil de usar.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>

// Subsistema 1: Gestión de audio
class AudioSystem {
public:
    void initialize() {
        std::cout << "AudioSystem: Inicializando subsistema de audio" << std::endl;
    }
    
    void setVolume(int level) {
        std::cout << "AudioSystem: Ajustando volumen al nivel " << level << std::endl;
    }
    
    void playSound(const std::string& soundFile) {
        std::cout << "AudioSystem: Reproduciendo sonido '" << soundFile << "'" << std::endl;
    }
    
    void shutdown() {
        std::cout << "AudioSystem: Apagando subsistema de audio" << std::endl;
    }
};

// Subsistema 2: Gestión de gráficos
class GraphicsSystem {
public:
    void initialize() {
        std::cout << "GraphicsSystem: Inicializando subsistema gráfico" << std::endl;
    }
    
    void renderObject(const std::string& objectName) {
        std::cout << "GraphicsSystem: Renderizando objeto '" << objectName << "'" << std::endl;
    }
    
    void clearScreen() {
        std::cout << "GraphicsSystem: Limpiando pantalla" << std::endl;
    }
    
    void shutdown() {
        std::cout << "GraphicsSystem: Apagando subsistema gráfico" << std::endl;
    }
};

// Subsistema 3: Gestión de entrada de usuario
class InputSystem {
public:
    void initialize() {
        std::cout << "InputSystem: Inicializando subsistema de entrada" << std::endl;
    }
    
    void readInput() {
        std::cout << "InputSystem: Leyendo entrada del usuario" << std::endl;
    }
    
    void shutdown() {
        std::cout << "InputSystem: Apagando subsistema de entrada" << std::endl;
    }
};

// Facade: Simplifica el uso de los subsistemas
class GameEngineFacade {
private:
    AudioSystem audioSystem;
    GraphicsSystem graphicsSystem;
    InputSystem inputSystem;
    
public:
    void startGame() {
        std::cout << "GameEngineFacade: Iniciando juego..." << std::endl;
        audioSystem.initialize();
        graphicsSystem.initialize();
        inputSystem.initialize();
        audioSystem.setVolume(50);
        graphicsSystem.clearScreen();
    }
    
    void playLevel(const std::string& levelName) {
        std::cout << "GameEngineFacade: Cargando nivel '" << levelName << "'..." << std::endl;
        graphicsSystem.renderObject("Level_" + levelName);
        graphicsSystem.renderObject("Player");
        audioSystem.playSound("level_" + levelName + "_music.mp3");
        
        // Ciclo de juego simulado
        for (int i = 0; i < 3; ++i) {
            inputSystem.readInput();
            graphicsSystem.renderObject("Updated_Scene");
        }
    }
    
    void endGame() {
        std::cout << "GameEngineFacade: Terminando juego..." << std::endl;
        audioSystem.shutdown();
        graphicsSystem.shutdown();
        inputSystem.shutdown();
    }
};

// Cliente que utiliza la fachada
int main() {
    GameEngineFacade game;
    
    // El cliente interactúa con la fachada simple, no con los subsistemas complejos
    game.startGame();
    game.playLevel("1");
    game.endGame();
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas estándar necesarias.' },
        { line: 4, text: 'AudioSystem representa un subsistema complejo que gestiona el audio del juego.' },
        { line: 6, text: 'Método para inicializar el subsistema de audio.' },
        { line: 10, text: 'Método para ajustar el volumen del audio.' },
        { line: 14, text: 'Método para reproducir un archivo de sonido específico.' },
        { line: 18, text: 'Método para apagar correctamente el subsistema de audio.' },
        { line: 24, text: 'GraphicsSystem representa otro subsistema complejo que maneja los gráficos del juego.' },
        { line: 30, text: 'Método para renderizar objetos en pantalla.' },
        { line: 34, text: 'Método para limpiar la pantalla antes de renderizar nuevos elementos.' },
        { line: 44, text: 'InputSystem es un tercer subsistema que gestiona la entrada del usuario.' },
        { line: 50, text: 'Método para leer y procesar la entrada del usuario.' },
        { line: 60, text: 'GameEngineFacade es la fachada que integra y simplifica el uso de los subsistemas.' },
        { line: 61, text: 'La fachada contiene instancias de cada uno de los subsistemas que coordina.' },
        { line: 67, text: 'startGame() proporciona una interfaz simple para inicializar todos los subsistemas de una vez.' },
        { line: 75, text: 'playLevel() coordina los subsistemas para cargar y ejecutar un nivel del juego.' },
        { line: 85, text: 'Simulamos un ciclo de juego donde se lee la entrada y se actualiza la pantalla.' },
        { line: 91, text: 'endGame() cierra ordenadamente todos los subsistemas.' },
        { line: 99, text: 'El cliente crea una instancia de la fachada.' },
        { line: 102, text: 'El cliente interactúa solo con la fachada, sin necesidad de conocer los detalles de los subsistemas.' }
      ]
    },
    
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <memory>
#include <vector>
#include <functional>

// Subsistema 1: Gestión de audio con interfaces modernas
class AudioSystem {
public:
    void initialize() const {
        std::cout << "AudioSystem: Inicializando subsistema de audio (moderno)" << std::endl;
    }
    
    void setVolume(int level) const {
        std::cout << "AudioSystem: Ajustando volumen al nivel " << level << std::endl;
    }
    
    void playSound(const std::string& soundFile) const {
        std::cout << "AudioSystem: Reproduciendo sonido '" << soundFile << "'" << std::endl;
    }
    
    void shutdown() const {
        std::cout << "AudioSystem: Apagando subsistema de audio" << std::endl;
    }
};

// Subsistema 2: Gestión de gráficos con interfaces modernas
class GraphicsSystem {
public:
    void initialize() const {
        std::cout << "GraphicsSystem: Inicializando subsistema gráfico (moderno)" << std::endl;
    }
    
    void renderObject(const std::string& objectName) const {
        std::cout << "GraphicsSystem: Renderizando objeto '" << objectName << "'" << std::endl;
    }
    
    void clearScreen() const {
        std::cout << "GraphicsSystem: Limpiando pantalla" << std::endl;
    }
    
    void shutdown() const {
        std::cout << "GraphicsSystem: Apagando subsistema gráfico" << std::endl;
    }
};

// Subsistema 3: Gestión de entrada de usuario con interfaces modernas
class InputSystem {
public:
    void initialize() const {
        std::cout << "InputSystem: Inicializando subsistema de entrada (moderno)" << std::endl;
    }
    
    void readInput() const {
        std::cout << "InputSystem: Leyendo entrada del usuario" << std::endl;
    }
    
    void shutdown() const {
        std::cout << "InputSystem: Apagando subsistema de entrada" << std::endl;
    }
};

// Interfaz para la inyección de dependencias en la fachada
class IGameEngineFacade {
public:
    virtual ~IGameEngineFacade() = default;
    virtual void startGame() = 0;
    virtual void playLevel(const std::string& levelName) = 0;
    virtual void endGame() = 0;
};

// Facade con inyección de dependencias y manejo moderno
class GameEngineFacade : public IGameEngineFacade {
private:
    std::shared_ptr<AudioSystem> audioSystem;
    std::shared_ptr<GraphicsSystem> graphicsSystem;
    std::shared_ptr<InputSystem> inputSystem;
    
    // Lista de funciones de limpieza para el RAII
    std::vector<std::function<void()>> cleanupHandlers;
    
public:
    // Constructor con inyección de dependencias
    GameEngineFacade(
        std::shared_ptr<AudioSystem> audio,
        std::shared_ptr<GraphicsSystem> graphics,
        std::shared_ptr<InputSystem> input)
        : audioSystem(std::move(audio)),
          graphicsSystem(std::move(graphics)),
          inputSystem(std::move(input)) {}
    
    // Constructor predeterminado que crea sus propias instancias
    GameEngineFacade()
        : audioSystem(std::make_shared<AudioSystem>()),
          graphicsSystem(std::make_shared<GraphicsSystem>()),
          inputSystem(std::make_shared<InputSystem>()) {}
    
    ~GameEngineFacade() override {
        // Ejecuta las funciones de limpieza en orden inverso
        for (auto it = cleanupHandlers.rbegin(); it != cleanupHandlers.rend(); ++it) {
            (*it)();
        }
    }
    
    void startGame() override {
        std::cout << "GameEngineFacade: Iniciando juego (moderno)..." << std::endl;
        
        // Guardamos manejadores de limpieza para RAII
        try {
            audioSystem->initialize();
            cleanupHandlers.push_back([this]() { audioSystem->shutdown(); });
            
            graphicsSystem->initialize();
            cleanupHandlers.push_back([this]() { graphicsSystem->shutdown(); });
            
            inputSystem->initialize();
            cleanupHandlers.push_back([this]() { inputSystem->shutdown(); });
            
            audioSystem->setVolume(50);
            graphicsSystem->clearScreen();
        } catch (const std::exception& e) {
            std::cerr << "Error al iniciar el juego: " << e.what() << std::endl;
            endGame();
            throw;
        }
    }
    
    void playLevel(const std::string& levelName) override {
        try {
            std::cout << "GameEngineFacade: Cargando nivel '" << levelName << "'..." << std::endl;
            graphicsSystem->renderObject("Level_" + levelName);
            graphicsSystem->renderObject("Player");
            audioSystem->playSound("level_" + levelName + "_music.mp3");
            
            // Ciclo de juego simulado
            for (int i = 0; i < 3; ++i) {
                inputSystem->readInput();
                graphicsSystem->renderObject("Updated_Scene");
            }
        } catch (const std::exception& e) {
            std::cerr << "Error al jugar nivel: " << e.what() << std::endl;
            throw;
        }
    }
    
    void endGame() override {
        std::cout << "GameEngineFacade: Terminando juego..." << std::endl;
        
        // Ejecutamos los manejadores de limpieza en orden inverso
        for (auto it = cleanupHandlers.rbegin(); it != cleanupHandlers.rend(); ++it) {
            try {
                (*it)();
            } catch (const std::exception& e) {
                std::cerr << "Error al finalizar: " << e.what() << std::endl;
            }
        }
        
        // Limpiamos los manejadores después de ejecutarlos
        cleanupHandlers.clear();
    }
};

// Cliente que utiliza la fachada a través de la interfaz
void clientCode(IGameEngineFacade& facade) {
    facade.startGame();
    facade.playLevel("1");
    facade.endGame();
}

int main() {
    // Uso con el constructor predeterminado
    std::cout << "Usando la fachada con el constructor predeterminado:" << std::endl;
    {
        GameEngineFacade game;
        clientCode(game);
    }
    
    std::cout << "\nUsando la fachada con inyección de dependencias:" << std::endl;
    {
        // Creación de subsistemas personalizados
        auto audio = std::make_shared<AudioSystem>();
        auto graphics = std::make_shared<GraphicsSystem>();
        auto input = std::make_shared<InputSystem>();
        
        // Inyección de dependencias
        GameEngineFacade customGame(audio, graphics, input);
        clientCode(customGame);
    }
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos bibliotecas adicionales para smart pointers, contenedores y functores.' },
        { line: 7, text: 'Los sistemas ahora tienen métodos const para mayor seguridad y encapsulación.' },
        { line: 60, text: 'Definimos una interfaz para la fachada que permitirá la inyección de dependencias y polimorfismo.' },
        { line: 70, text: 'La implementación de la fachada ahora hereda de una interfaz.' },
        { line: 72, text: 'Usamos smart pointers para gestionar automáticamente la memoria de los subsistemas.' },
        { line: 75, text: 'Implementamos un vector de funciones para limpiar recursos (patrón RAII).' },
        { line: 79, text: 'Constructor con inyección de dependencias que permite mayor flexibilidad y testabilidad.' },
        { line: 86, text: 'Constructor predeterminado que crea sus propias instancias usando std::make_shared.' },
        { line: 91, text: 'Destructor que ejecuta las funciones de limpieza en orden inverso (LIFO).' },
        { line: 101, text: 'Implementamos manejo de errores con try-catch.' },
        { line: 103, text: 'Registramos funciones de limpieza usando lambdas para garantizar que los recursos se liberen correctamente.' },
        { line: 145, text: 'endGame() ahora ejecuta los manejadores de limpieza con manejo de excepciones.' },
        { line: 159, text: 'La función cliente ahora trabaja con la interfaz en lugar de la implementación concreta.' },
        { line: 166, text: 'Usamos bloques de alcance para controlar el ciclo de vida de los objetos.' },
        { line: 175, text: 'Demostramos la inyección de dependencias creando subsistemas personalizados.' }
      ]
    },
    
    java: {
      code: `import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

// Subsistema 1: Gestión de audio
class AudioSystem {
    public void initialize() {
        System.out.println("AudioSystem: Inicializando subsistema de audio");
    }
    
    public void setVolume(int level) {
        System.out.println("AudioSystem: Ajustando volumen al nivel " + level);
    }
    
    public void playSound(String soundFile) {
        System.out.println("AudioSystem: Reproduciendo sonido '" + soundFile + "'");
    }
    
    public void shutdown() {
        System.out.println("AudioSystem: Apagando subsistema de audio");
    }
}

// Subsistema 2: Gestión de gráficos
class GraphicsSystem {
    public void initialize() {
        System.out.println("GraphicsSystem: Inicializando subsistema gráfico");
    }
    
    public void renderObject(String objectName) {
        System.out.println("GraphicsSystem: Renderizando objeto '" + objectName + "'");
    }
    
    public void clearScreen() {
        System.out.println("GraphicsSystem: Limpiando pantalla");
    }
    
    public void shutdown() {
        System.out.println("GraphicsSystem: Apagando subsistema gráfico");
    }
}

// Subsistema 3: Gestión de entrada de usuario
class InputSystem {
    public void initialize() {
        System.out.println("InputSystem: Inicializando subsistema de entrada");
    }
    
    public void readInput() {
        System.out.println("InputSystem: Leyendo entrada del usuario");
    }
    
    public void shutdown() {
        System.out.println("InputSystem: Apagando subsistema de entrada");
    }
}

// Interfaz para la fachada
interface GameEngineFacade {
    void startGame();
    void playLevel(String levelName);
    void endGame();
}

// AutoCloseable para manejar recursos en Java
interface CleanupHandler extends AutoCloseable {
    @Override
    void close();
}

// Implementación de la fachada con manejo de recursos
class GameEngineFacadeImpl implements GameEngineFacade, AutoCloseable {
    private final AudioSystem audioSystem;
    private final GraphicsSystem graphicsSystem;
    private final InputSystem inputSystem;
    private final List<CleanupHandler> cleanupHandlers = new ArrayList<>();
    
    // Constructor con inyección de dependencias
    public GameEngineFacadeImpl(AudioSystem audioSystem, 
                               GraphicsSystem graphicsSystem, 
                               InputSystem inputSystem) {
        this.audioSystem = audioSystem;
        this.graphicsSystem = graphicsSystem;
        this.inputSystem = inputSystem;
    }
    
    // Constructor predeterminado
    public GameEngineFacadeImpl() {
        this(new AudioSystem(), new GraphicsSystem(), new InputSystem());
    }
    
    @Override
    public void startGame() {
        System.out.println("GameEngineFacade: Iniciando juego...");
        
        try {
            audioSystem.initialize();
            registerCleanupHandler(audioSystem::shutdown);
            
            graphicsSystem.initialize();
            registerCleanupHandler(graphicsSystem::shutdown);
            
            inputSystem.initialize();
            registerCleanupHandler(inputSystem::shutdown);
            
            audioSystem.setVolume(50);
            graphicsSystem.clearScreen();
        } catch (Exception e) {
            System.err.println("Error al iniciar el juego: " + e.getMessage());
            endGame();
            throw e;
        }
    }
    
    @Override
    public void playLevel(String levelName) {
        try {
            System.out.println("GameEngineFacade: Cargando nivel '" + levelName + "'...");
            graphicsSystem.renderObject("Level_" + levelName);
            graphicsSystem.renderObject("Player");
            audioSystem.playSound("level_" + levelName + "_music.mp3");
            
            // Ciclo de juego simulado
            for (int i = 0; i < 3; i++) {
                inputSystem.readInput();
                graphicsSystem.renderObject("Updated_Scene");
            }
        } catch (Exception e) {
            System.err.println("Error al jugar nivel: " + e.getMessage());
            throw e;
        }
    }
    
    @Override
    public void endGame() {
        System.out.println("GameEngineFacade: Terminando juego...");
        
        // Ejecutar limpieza en orden inverso
        for (int i = cleanupHandlers.size() - 1; i >= 0; i--) {
            try {
                cleanupHandlers.get(i).close();
            } catch (Exception e) {
                System.err.println("Error al finalizar: " + e.getMessage());
            }
        }
        
        cleanupHandlers.clear();
    }
    
    // Método para registrar manejadores de limpieza
    private void registerCleanupHandler(Runnable cleanupAction) {
        cleanupHandlers.add(() -> cleanupAction.run());
    }
    
    // Método para crear un manejador de limpieza a partir de una acción
    private CleanupHandler createCleanupHandler(Runnable cleanupAction) {
        return () -> cleanupAction.run();
    }
    
    // Implementación de AutoCloseable para usar try-with-resources
    @Override
    public void close() {
        endGame();
    }
}

// Clase de demostración
public class FacadeDemo {
    // Método cliente que usa la fachada a través de la interfaz
    public static void clientCode(GameEngineFacade facade) {
        facade.startGame();
        facade.playLevel("1");
        facade.endGame();
    }
    
    public static void main(String[] args) {
        System.out.println("Usando la fachada con constructor predeterminado:");
        
        // Uso con try-with-resources para cierre automático
        try (GameEngineFacadeImpl game = new GameEngineFacadeImpl()) {
            clientCode(game);
        }
        
        System.out.println("\nUsando la fachada con inyección de dependencias:");
        
        // Creación de subsistemas personalizados
        AudioSystem audio = new AudioSystem();
        GraphicsSystem graphics = new GraphicsSystem();
        InputSystem input = new InputSystem();
        
        // Uso con inyección de dependencias y try-with-resources
        try (GameEngineFacadeImpl customGame = new GameEngineFacadeImpl(audio, graphics, input)) {
            clientCode(customGame);
        }
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos las clases necesarias para listas y funciones.' },
        { line: 5, text: 'Implementamos los subsistemas de forma similar a las versiones en C++.' },
        { line: 58, text: 'Definimos una interfaz Java para la fachada.' },
        { line: 65, text: 'Creamos una interfaz CleanupHandler que extiende AutoCloseable para gestión de recursos.' },
        { line: 71, text: 'La implementación de la fachada implementa tanto la interfaz GameEngineFacade como AutoCloseable.' },
        { line: 76, text: 'Constructor con inyección de dependencias para mayor flexibilidad y testabilidad.' },
        { line: 83, text: 'Constructor predeterminado que crea sus propias instancias de los subsistemas.' },
        { line: 88, text: 'startGame() inicializa los subsistemas y registra manejadores de limpieza.' },
        { line: 92, text: 'Usamos referencias a métodos (method references) para registrar las acciones de limpieza.' },
        { line: 133, text: 'En endGame(), ejecutamos los manejadores de limpieza en orden inverso con manejo de excepciones.' },
        { line: 146, text: 'Método helper para registrar acciones de limpieza.' },
        { line: 151, text: 'Método para crear un manejador de limpieza a partir de una acción.' },
        { line: 156, text: 'Implementación del método close() de AutoCloseable para uso con try-with-resources.' },
        { line: 167, text: 'La función cliente trabaja con la interfaz, no con la implementación.' },
        { line: 175, text: 'Usamos try-with-resources para garantizar la liberación de recursos automáticamente.' },
        { line: 183, text: 'Demostramos la inyección de dependencias con subsistemas personalizados.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Gestión de recursos',
      cppTraditional: 'Gestión manual de recursos. No hay garantía automática de que los subsistemas se cierren correctamente si ocurre una excepción.',
      cppModern: 'Implementa el patrón RAII (Resource Acquisition Is Initialization) utilizando smart pointers y functores. Los recursos se liberan automáticamente en el destructor, incluso en caso de excepciones.',
      java: 'Utiliza la interfaz AutoCloseable y try-with-resources para garantizar la liberación de recursos, similar al RAII de C++. Proporciona cierre automático cuando el objeto sale del ámbito.'
    },
    {
      title: 'Flexibilidad y extensibilidad',
      cppTraditional: 'Diseño rígido con subsistemas integrados directamente en la fachada. Difícil de extender o personalizar sin modificar la clase Facade.',
      cppModern: 'Mayor flexibilidad mediante interfaces, inyección de dependencias y polimorfismo. Permite fácil extensión y personalización con diferentes implementaciones de subsistemas.',
      java: 'Enfoque similar al C++ moderno, usando interfaces e inyección de dependencias. La implementación es más limpia gracias al soporte nativo de interfaces en Java.'
    },
    {
      title: 'Manejo de errores',
      cppTraditional: 'Manejo de errores mínimo o inexistente. Si un subsistema falla, puede dejar al sistema en un estado inconsistente.',
      cppModern: 'Manejo robusto de excepciones con bloques try-catch. Garantiza la limpieza adecuada incluso cuando ocurren errores.',
      java: 'Manejo de excepciones integrado con try-catch y try-with-resources. Las excepciones se capturan y registran en múltiples niveles para asegurar la robustez.'
    }
  ],
  
  theory: {
    background: 'El patrón Facade fue introducido como parte de los 23 patrones del Gang of Four (GoF). Está inspirado en la arquitectura de edificios, donde una fachada proporciona una cara simplificada a un sistema más complejo detrás.',
    problem: 'Un sistema orientado a objetos típicamente contiene muchas clases con interfaces complejas. Los clientes necesitan entender detalles de implementación para usar el sistema correctamente, creando un acoplamiento fuerte. Además, las funcionalidades complejas requieren que los clientes coordinen múltiples subsistemas, lo que aumenta la complejidad del código cliente.',
    solution: 'El patrón Facade proporciona una interfaz unificada de alto nivel para un conjunto de interfaces en un subsistema. Define una interfaz simplificada que hace que el subsistema sea más fácil de usar, ocultando su complejidad y facilitando su utilización por parte de los clientes.',
    applicability: [
      'Cuando se necesita proporcionar una interfaz simple y unificada para un subsistema complejo.',
      'Para desacoplar un subsistema de sus clientes y otros subsistemas, promoviendo la independencia y portabilidad.',
      'Para estructurar un sistema en capas, donde la fachada define el punto de entrada a cada nivel del subsistema.',
      'Cuando se desea reducir las dependencias entre los clientes y las implementaciones concretas del subsistema.',
      'Para envolver una API pobremente diseñada o compleja con una interfaz más limpia y amigable.'
    ],
    benefits: [
      'Simplifica el uso de subsistemas complejos proporcionando una única interfaz de alto nivel.',
      'Reduce el acoplamiento entre los clientes y los subsistemas, permitiendo cambios en la implementación sin afectar al código cliente.',
      'Promueve el principio de "mínimo conocimiento" (Ley de Demeter), donde los objetos solo interactúan con sus "vecinos cercanos".',
      'Organiza el sistema en capas, mejorando la estructura y mantenibilidad del código.',
      'Oculta los detalles de implementación, protegiendo a los clientes de cambios internos en los subsistemas.'
    ],
    drawbacks: [
      'Puede convertirse en un "objeto Dios" que conoce demasiado sobre los subsistemas si no se diseña adecuadamente.',
      'Añade una capa adicional de indirección que podría afectar el rendimiento en sistemas críticos.',
      'La fachada podría ocultar funcionalidades importantes de los subsistemas que algunos clientes avanzados podrían necesitar.',
      'Puede tentarnos a evitar el rediseño de subsistemas deficientes, usándola como un "parche" en lugar de resolver los problemas fundamentales.',
      'Si la fachada crece demasiado, puede violar el principio de responsabilidad única al asumir demasiadas funciones.'
    ]
  }
};

export default facadePattern;
