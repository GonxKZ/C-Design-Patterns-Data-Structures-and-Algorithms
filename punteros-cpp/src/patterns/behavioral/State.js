const statePattern = {
  id: 'state',
  name: 'State',
  category: 'behavioral',
  description: 'El patrón State permite a un objeto alterar su comportamiento cuando su estado interno cambia. Parece como si el objeto cambiara su clase.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>
#include <memory>

// Forward declaration
class State;

// Contexto que mantiene una referencia al estado actual
class Context {
private:
    State* state_; // Puntero al estado actual

public:
    Context(State* state);
    ~Context();
    
    // Cambia el estado actual
    void TransitionTo(State* state);
    
    // Acciones que dependen del estado
    void Request1();
    void Request2();
};

// Clase base abstracta para todos los estados
class State {
protected:
    Context* context_;

public:
    virtual ~State() {}
    
    void SetContext(Context* context) {
        context_ = context;
    }
    
    // Métodos que cada estado concreto debe implementar
    virtual void Handle1() = 0;
    virtual void Handle2() = 0;
};

// Estados concretos que implementan comportamientos específicos
class ConcreteStateA : public State {
public:
    void Handle1() override;
    void Handle2() override {
        std::cout << "ConcreteStateA maneja la solicitud 2." << std::endl;
        std::cout << "ConcreteStateA quiere cambiar el estado del contexto." << std::endl;
        context_->TransitionTo(new ConcreteStateB());
    }
};

class ConcreteStateB : public State {
public:
    void Handle1() override {
        std::cout << "ConcreteStateB maneja la solicitud 1." << std::endl;
    }
    
    void Handle2() override {
        std::cout << "ConcreteStateB maneja la solicitud 2." << std::endl;
        std::cout << "ConcreteStateB quiere cambiar el estado del contexto." << std::endl;
        context_->TransitionTo(new ConcreteStateA());
    }
};

// Implementación de los métodos de Context
Context::Context(State* state) : state_(nullptr) {
    TransitionTo(state);
}

Context::~Context() {
    delete state_;
}

void Context::TransitionTo(State* state) {
    if (state_) {
        delete state_;
    }
    state_ = state;
    state_->SetContext(this);
}

void Context::Request1() {
    state_->Handle1();
}

void Context::Request2() {
    state_->Handle2();
}

// Implementación del método de ConcreteStateA
void ConcreteStateA::Handle1() {
    std::cout << "ConcreteStateA maneja la solicitud 1." << std::endl;
}

// Cliente
int main() {
    // El cliente crea un contexto y lo inicializa con un estado concreto
    Context* context = new Context(new ConcreteStateA());
    
    // El cliente interactúa con el contexto
    std::cout << "Cliente: Ejecutando Request1:" << std::endl;
    context->Request1();
    
    std::cout << "Cliente: Ejecutando Request2:" << std::endl;
    context->Request2();
    
    std::cout << "Cliente: Ejecutando otra vez Request1:" << std::endl;
    context->Request1();
    
    std::cout << "Cliente: Ejecutando otra vez Request2:" << std::endl;
    context->Request2();
    
    delete context;
    
    return 0;
}`,
      explanation: [
        { line: 8, text: 'La clase Context mantiene una referencia al estado actual y delega el comportamiento específico del estado a ese objeto.' },
        { line: 14, text: 'Método para cambiar el estado actual del contexto.' },
        { line: 17, text: 'Métodos que serán manejados por el estado actual.' },
        { line: 23, text: 'La clase base abstracta State define la interfaz para todas las clases que representan diferentes estados.' },
        { line: 30, text: 'Este método permite al estado acceder al contexto para realizar transiciones de estado.' },
        { line: 34, text: 'Métodos abstractos que cada estado concreto debe implementar con comportamiento específico.' },
        { line: 39, text: 'ConcreteStateA es una implementación concreta de State con comportamiento específico.' },
        { line: 42, text: 'Handle2 en ConcreteStateA realiza la transición al estado ConcreteStateB.' },
        { line: 50, text: 'ConcreteStateB es otra implementación concreta con comportamiento distinto.' },
        { line: 58, text: 'Handle2 en ConcreteStateB realiza la transición de vuelta al estado ConcreteStateA.' },
        { line: 64, text: 'El constructor de Context inicializa el estado.' },
        { line: 72, text: 'TransitionTo cambia el estado actual y actualiza la referencia del estado al contexto.' },
        { line: 80, text: 'Las solicitudes del contexto se delegan al estado actual.' },
        { line: 93, text: 'El cliente crea un contexto inicializado con ConcreteStateA.' },
        { line: 96, text: 'El cliente interactúa con el contexto sin preocuparse por el estado concreto.' }
      ]
    },
    
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <memory>
#include <unordered_map>
#include <functional>

// Forward declarations
class PlayerState;
class IdleState;
class WalkingState;
class RunningState;

// Clase MediaPlayer que utiliza el patrón State
class MediaPlayer {
private:
    std::shared_ptr<PlayerState> currentState;
    std::string playerName;
    double speed;
    bool isPlaying;
    
    // Permitimos que los estados accedan a los miembros privados
    friend class PlayerState;
    friend class IdleState;
    friend class WalkingState;
    friend class RunningState;

public:
    MediaPlayer(const std::string& name);
    
    // Operaciones que dependen del estado
    void play();
    void pause();
    void stop();
    void increaseSpeed();
    void decreaseSpeed();
    
    // Cambiar estado
    void changeState(std::shared_ptr<PlayerState> newState);
    
    // Getters
    std::string getStateName() const;
    std::string getPlayerName() const { return playerName; }
    double getSpeed() const { return speed; }
    bool getIsPlaying() const { return isPlaying; }
    
    // Setters
    void setSpeed(double newSpeed) { speed = newSpeed; }
    void setIsPlaying(bool playing) { isPlaying = playing; }
};

// Clase base abstracta para estados
class PlayerState {
protected:
    MediaPlayer* player;

public:
    PlayerState() : player(nullptr) {}
    virtual ~PlayerState() = default;
    
    void setContext(MediaPlayer* mediaPlayer) {
        player = mediaPlayer;
    }
    
    // Métodos que cada estado concreto debe implementar
    virtual void play() = 0;
    virtual void pause() = 0;
    virtual void stop() = 0;
    virtual void increaseSpeed() = 0;
    virtual void decreaseSpeed() = 0;
    virtual std::string getName() const = 0;
};

// Estado Idle (reproductor detenido)
class IdleState : public PlayerState {
public:
    void play() override;
    void pause() override {
        std::cout << player->getPlayerName() << ": No se puede pausar desde el estado detenido." << std::endl;
    }
    
    void stop() override {
        std::cout << player->getPlayerName() << ": Ya está detenido." << std::endl;
    }
    
    void increaseSpeed() override {
        std::cout << player->getPlayerName() << ": No se puede aumentar velocidad cuando está detenido." << std::endl;
    }
    
    void decreaseSpeed() override {
        std::cout << player->getPlayerName() << ": No se puede disminuir velocidad cuando está detenido." << std::endl;
    }
    
    std::string getName() const override {
        return "Idle";
    }
};

// Estado Walking (reproduciendo normal)
class WalkingState : public PlayerState {
public:
    void play() override {
        std::cout << player->getPlayerName() << ": Ya está reproduciendo." << std::endl;
    }
    
    void pause() override;
    void stop() override;
    void increaseSpeed() override;
    
    void decreaseSpeed() override {
        std::cout << player->getPlayerName() << ": Velocidad ya es normal." << std::endl;
    }
    
    std::string getName() const override {
        return "Walking";
    }
};

// Estado Running (reproduciendo a alta velocidad)
class RunningState : public PlayerState {
public:
    void play() override {
        std::cout << player->getPlayerName() << ": Ya está reproduciendo a alta velocidad." << std::endl;
    }
    
    void pause() override;
    void stop() override;
    
    void increaseSpeed() override {
        double currentSpeed = player->getSpeed();
        if (currentSpeed < 3.0) {
            currentSpeed += 0.5;
            player->setSpeed(currentSpeed);
            std::cout << player->getPlayerName() << ": Velocidad aumentada a " << currentSpeed << "x" << std::endl;
        } else {
            std::cout << player->getPlayerName() << ": Velocidad máxima alcanzada." << std::endl;
        }
    }
    
    void decreaseSpeed() override;
    
    std::string getName() const override {
        return "Running";
    }
};

// Implementación de MediaPlayer
MediaPlayer::MediaPlayer(const std::string& name) 
    : playerName(name), speed(1.0), isPlaying(false) {
    // Inicializar con estado Idle
    currentState = std::make_shared<IdleState>();
    currentState->setContext(this);
}

void MediaPlayer::changeState(std::shared_ptr<PlayerState> newState) {
    currentState = newState;
    currentState->setContext(this);
    std::cout << playerName << ": Cambió al estado " << newState->getName() << std::endl;
}

std::string MediaPlayer::getStateName() const {
    return currentState->getName();
}

// Delegar comportamiento al estado actual
void MediaPlayer::play() {
    currentState->play();
}

void MediaPlayer::pause() {
    currentState->pause();
}

void MediaPlayer::stop() {
    currentState->stop();
}

void MediaPlayer::increaseSpeed() {
    currentState->increaseSpeed();
}

void MediaPlayer::decreaseSpeed() {
    currentState->decreaseSpeed();
}

// Implementaciones restantes de los métodos de estado

void IdleState::play() {
    std::cout << player->getPlayerName() << ": Iniciando reproducción." << std::endl;
    player->setIsPlaying(true);
    player->setSpeed(1.0);
    player->changeState(std::make_shared<WalkingState>());
}

void WalkingState::pause() {
    std::cout << player->getPlayerName() << ": Pausando reproducción." << std::endl;
    player->setIsPlaying(false);
    player->changeState(std::make_shared<IdleState>());
}

void WalkingState::stop() {
    std::cout << player->getPlayerName() << ": Deteniendo reproducción." << std::endl;
    player->setIsPlaying(false);
    player->setSpeed(1.0);
    player->changeState(std::make_shared<IdleState>());
}

void WalkingState::increaseSpeed() {
    std::cout << player->getPlayerName() << ": Aumentando velocidad a 2x." << std::endl;
    player->setSpeed(2.0);
    player->changeState(std::make_shared<RunningState>());
}

void RunningState::decreaseSpeed() {
    std::cout << player->getPlayerName() << ": Disminuyendo velocidad a normal." << std::endl;
    player->setSpeed(1.0);
    player->changeState(std::make_shared<WalkingState>());
}

void RunningState::pause() {
    std::cout << player->getPlayerName() << ": Pausando reproducción de alta velocidad." << std::endl;
    player->setIsPlaying(false);
    player->setSpeed(1.0);
    player->changeState(std::make_shared<IdleState>());
}

void RunningState::stop() {
    std::cout << player->getPlayerName() << ": Deteniendo reproducción de alta velocidad." << std::endl;
    player->setIsPlaying(false);
    player->setSpeed(1.0);
    player->changeState(std::make_shared<IdleState>());
}

// Función de prueba
int main() {
    // Crear un reproductor de medios
    MediaPlayer player("MiReproductor");
    
    std::cout << "Estado inicial: " << player.getStateName() << std::endl;
    
    // Probar diferentes operaciones
    player.play();
    player.increaseSpeed();
    player.increaseSpeed();
    player.decreaseSpeed();
    player.pause();
    player.play();
    player.stop();
    
    return 0;
}`,
      explanation: [
        { line: 13, text: 'La clase MediaPlayer mantiene el estado actual y delega el comportamiento específico a ese estado.' },
        { line: 15, text: 'Atributos que representan el estado interno del reproductor.' },
        { line: 24, text: 'Operaciones que dependen del estado actual.' },
        { line: 31, text: 'Método para cambiar de un estado a otro.' },
        { line: 50, text: 'Clase base abstracta para todos los estados del reproductor.' },
        { line: 56, text: 'Método para configurar la referencia al contexto (reproductor).' },
        { line: 60, text: 'Métodos abstractos que cada estado concreto debe implementar.' },
        { line: 69, text: 'IdleState representa el estado cuando el reproductor está detenido.' },
        { line: 71, text: 'Implementación específica para reproducir desde estado detenido - transiciona a WalkingState.' },
        { line: 91, text: 'WalkingState representa el estado cuando el reproductor está reproduciendo a velocidad normal.' },
        { line: 103, text: 'Aumentar velocidad desde WalkingState transiciona a RunningState.' },
        { line: 114, text: 'RunningState representa el estado cuando el reproductor está reproduciendo a alta velocidad.' },
        { line: 144, text: 'Constructor de MediaPlayer que inicializa el reproductor en estado Idle.' },
        { line: 151, text: 'Método para cambiar estado que actualiza la referencia del contexto.' },
        { line: 165, text: 'Las operaciones del reproductor se delegan al estado actual.' },
        { line: 202, text: 'La función main demuestra cómo el comportamiento del reproductor cambia según su estado.' }
      ]
    },
    
    java: {
      code: `import java.util.HashMap;
import java.util.Map;

// Interfaz para todos los estados
interface DocumentState {
    void edit(Document document);
    void review(Document document);
    void publish(Document document);
    void reject(Document document);
    String getName();
}

// Clase contexto que mantiene el estado actual
class Document {
    private DocumentState state;
    private String content;
    private String name;
    private String author;
    private Map<String, String> comments;

    public Document(String name, String author) {
        this.name = name;
        this.author = author;
        this.content = "";
        this.comments = new HashMap<>();
        // Estado inicial: Borrador
        this.state = new DraftState();
    }

    // Cambiar el estado
    public void changeState(DocumentState state) {
        this.state = state;
        System.out.println(name + " ha cambiado al estado: " + state.getName());
    }

    // Acciones que dependen del estado
    public void edit() {
        state.edit(this);
    }

    public void review() {
        state.review(this);
    }

    public void publish() {
        state.publish(this);
    }

    public void reject() {
        state.reject(this);
    }

    // Getters y setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getName() {
        return name;
    }

    public String getAuthor() {
        return author;
    }

    public Map<String, String> getComments() {
        return comments;
    }

    public void addComment(String reviewer, String comment) {
        comments.put(reviewer, comment);
    }

    public String getStateName() {
        return state.getName();
    }
}

// Implementaciones concretas de los estados
class DraftState implements DocumentState {
    @Override
    public void edit(Document document) {
        System.out.println(document.getName() + ": Editando documento en estado borrador.");
    }

    @Override
    public void review(Document document) {
        System.out.println(document.getName() + ": Enviando documento a revisión.");
        document.changeState(new ReviewState());
    }

    @Override
    public void publish(Document document) {
        System.out.println(document.getName() + ": No se puede publicar directamente desde borrador. Primero debe ser revisado.");
    }

    @Override
    public void reject(Document document) {
        System.out.println(document.getName() + ": No se puede rechazar un borrador que aún no ha sido revisado.");
    }

    @Override
    public String getName() {
        return "Borrador";
    }
}

class ReviewState implements DocumentState {
    @Override
    public void edit(Document document) {
        System.out.println(document.getName() + ": No se puede editar durante la revisión.");
    }

    @Override
    public void review(Document document) {
        System.out.println(document.getName() + ": El documento ya está en revisión.");
    }

    @Override
    public void publish(Document document) {
        System.out.println(document.getName() + ": Documento aprobado. Publicando...");
        document.changeState(new PublishedState());
    }

    @Override
    public void reject(Document document) {
        System.out.println(document.getName() + ": Documento rechazado. Volviendo a borrador con comentarios.");
        document.changeState(new DraftState());
    }

    @Override
    public String getName() {
        return "En Revisión";
    }
}

class PublishedState implements DocumentState {
    @Override
    public void edit(Document document) {
        System.out.println(document.getName() + ": Creando nueva versión del documento publicado.");
        document.changeState(new DraftState());
    }

    @Override
    public void review(Document document) {
        System.out.println(document.getName() + ": El documento ya está publicado. Para revisarlo nuevamente, debe editarlo primero.");
    }

    @Override
    public void publish(Document document) {
        System.out.println(document.getName() + ": El documento ya está publicado.");
    }

    @Override
    public void reject(Document document) {
        System.out.println(document.getName() + ": Retirando documento publicado debido a problemas. Volviendo a borrador.");
        document.changeState(new DraftState());
    }

    @Override
    public String getName() {
        return "Publicado";
    }
}

// Demostración del patrón State
public class StatePatternDemo {
    public static void main(String[] args) {
        // Crear un documento
        Document doc = new Document("Informe Anual", "Juan Pérez");
        
        System.out.println("Estado inicial: " + doc.getStateName());
        
        // Añadir contenido
        doc.setContent("Este es el contenido del informe anual...");
        
        // Probar transiciones de estado
        doc.edit();                // OK en estado borrador
        doc.review();              // Cambia a estado de revisión
        doc.edit();                // No permitido en estado de revisión
        
        // Añadir comentarios de revisión
        doc.addComment("Revisor 1", "Excelente informe, aprobado.");
        
        // Publicar documento
        doc.publish();             // Cambia a estado publicado
        doc.publish();             // Ya está publicado
        
        // Editar documento publicado
        doc.edit();                // Crea nueva versión (vuelve a borrador)
        System.out.println("Estado después de editar documento publicado: " + doc.getStateName());
        
        // Volver a revisar
        doc.review();              // Vuelve a estado de revisión
        
        // Rechazar documento
        doc.reject();              // Vuelve a borrador
        System.out.println("Estado final: " + doc.getStateName());
    }
}`,
      explanation: [
        { line: 5, text: 'Interfaz DocumentState define operaciones que cada estado debe implementar.' },
        { line: 13, text: 'Clase Document actúa como contexto, manteniendo una referencia al estado actual.' },
        { line: 23, text: 'El constructor inicializa el documento en estado borrador (DraftState).' },
        { line: 29, text: 'Método para cambiar el estado actual del documento.' },
        { line: 34, text: 'Las acciones del documento se delegan al estado actual.' },
        { line: 74, text: 'Clase DraftState implementa comportamiento específico para el estado borrador.' },
        { line: 84, text: 'El método review cambia el estado a ReviewState.' },
        { line: 87, text: 'Algunas acciones no están permitidas en ciertos estados.' },
        { line: 106, text: 'Clase ReviewState implementa comportamiento para cuando el documento está en revisión.' },
        { line: 120, text: 'El método publish cambia el estado a PublishedState.' },
        { line: 126, text: 'El método reject devuelve el documento al estado DraftState.' },
        { line: 140, text: 'Clase PublishedState implementa comportamiento para documentos publicados.' },
        { line: 144, text: 'Editar un documento publicado crea una nueva versión (vuelve a DraftState).' },
        { line: 170, text: 'La clase de demostración muestra cómo el comportamiento del documento cambia según su estado.' },
        { line: 176, text: 'Creamos un documento que inicialmente está en estado borrador.' },
        { line: 184, text: 'Las transiciones de estado ocurren en respuesta a las acciones realizadas.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Manejo de estados',
      cppTraditional: 'Implementación básica con punteros crudos que requiere gestión manual de memoria, lo que puede llevar a fugas de memoria si no se maneja adecuadamente.',
      cppModern: 'Usa smart pointers (shared_ptr) para administración automática de memoria, lo que evita fugas y simplifica el código.',
      java: 'Utiliza interfaces y tiene gestión automática de memoria mediante el recolector de basura, eliminando preocupaciones sobre fugas de memoria.'
    },
    {
      title: 'Transiciones de estado',
      cppTraditional: 'Las transiciones de estado requieren crear manualmente nuevas instancias y gestionar la memoria de los estados antiguos.',
      cppModern: 'Las transiciones utilizan std::make_shared para crear nuevos estados, lo que es más seguro y legible.',
      java: 'Las transiciones son simples asignaciones de objetos, ya que la gestión de memoria es automática. El código resulta más claro y directo.'
    },
    {
      title: 'Aplicación práctica',
      cppTraditional: 'Ejemplo abstracto que muestra la estructura básica del patrón, útil para comprender el concepto pero menos aplicable directamente.',
      cppModern: 'Aplicado a un caso de reproductor multimedia con estados que representan diferentes modos de reproducción, demostrando un uso práctico.',
      java: 'Implementado en un sistema de gestión de documentos con estados que representan las etapas del ciclo de vida del documento, mostrando un escenario real de uso.'
    }
  ],
  
  theory: {
    background: 'El patrón State fue introducido como uno de los 23 patrones de diseño del Gang of Four (GoF). Se clasifica como un patrón de comportamiento porque se ocupa de algoritmos y la asignación de responsabilidades entre objetos.',
    problem: 'Cuando el comportamiento de un objeto debe cambiar dependiendo de su estado interno, y el número de posibles estados es grande o puede cambiar con el tiempo, el uso de condicionales en cada método crea código difícil de mantener y extender.',
    solution: 'El patrón State sugiere crear nuevas clases para cada estado posible del objeto y extraer los comportamientos específicos de estado en estas clases. El objeto original, llamado contexto, almacena una referencia a un objeto de estado que representa su estado actual y delega todas las operaciones relacionadas con el estado a este objeto.',
    applicability: [
      'Cuando el comportamiento de un objeto depende de su estado y debe cambiar en tiempo de ejecución.',
      'Cuando hay operaciones con múltiples condicionales que dependen del estado del objeto.',
      'Cuando se desea evitar código con muchas condiciones relacionadas con el estado en múltiples métodos.',
      'Cuando las transiciones de estado siguen reglas definidas que pueden ser encapsuladas dentro de las clases de estado.',
      'Para reducir la complejidad del código cuando hay muchos estados posibles y transiciones entre ellos.'
    ],
    benefits: [
      'Organiza el código relacionado con estados específicos en clases separadas.',
      'Hace las transiciones de estado explícitas.',
      'Permite que los estados sean objetos que pueden ser compartidos.',
      'Facilita agregar nuevos estados sin cambiar el contexto ni otros estados existentes.',
      'Elimina las instrucciones condicionales largas y complejas.'
    ],
    drawbacks: [
      'Puede ser excesivo para máquinas de estado simples con pocos estados.',
      'Introduce muchas clases pequeñas, lo que puede ser difícil de seguir si el número de estados es muy grande.',
      'Si hay muchas transiciones entre estados, puede ser difícil mantener la consistencia.',
      'Las reglas de transición pueden quedar dispersas entre diferentes clases de estado.',
      'Puede complicar el código si se requiere compartir información entre diferentes estados.'
    ]
  }
};

export default statePattern;
