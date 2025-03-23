const statePattern = {
  id: 'state',
  name: 'State',
  category: 'behavioral',
  description: 'Permite a un objeto alterar su comportamiento cuando su estado interno cambia. El objeto parecerá cambiar su clase, facilitando la gestión de estados complejos sin utilizar grandes condicionales. Este patrón es especialmente útil para modelar máquinas de estados, procesos con ciclos de vida definidos y sistemas cuyo comportamiento varía significativamente según su estado.',
  
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
    background: 'El patrón State fue formalizado por la Banda de los Cuatro (GoF) y se inspira en las máquinas de estados finitos de la teoría de autómatas. Este patrón permite que un objeto altere su comportamiento cuando su estado interno cambia, sin recurrir a condicionales extensos y complejos, proporcionando una forma elegante de gestionar estados múltiples. Su diseño refleja el concepto matemático de autómatas de estado finito, donde un sistema puede existir en un número limitado de estados y las transiciones entre estos estados están bien definidas y ocurren en respuesta a eventos específicos.',
    
    problem: 'Cuando el comportamiento de un objeto debe cambiar dependiendo de su estado interno, y el número de posibles estados es grande o puede cambiar con el tiempo, el uso de condicionales en cada método crea código difícil de mantener y extender. Estos condicionales esparcidos por todo el código generan complejidad, redundancia y dificultad para añadir nuevos estados. Además, la lógica de transición entre estados queda distribuida y fragmentada a lo largo del código, dificultando la comprensión del ciclo de vida completo del objeto y aumentando el riesgo de errores cuando se modifican las reglas de transición o se añaden nuevos estados.',
    
    solution: 'El patrón State resuelve este problema definiendo una clase separada para cada estado posible del objeto y extrayendo los comportamientos específicos de cada estado en estas clases individuales. La idea fundamental es convertir estados condicionales en jerarquías de clases y relaciones de composición. El objeto original, llamado contexto, mantiene una referencia a un objeto de estado que representa su estado actual y delega todas las operaciones relacionadas con el estado a este objeto. Para cambiar el estado del contexto, simplemente se reemplaza el objeto de estado activo con otro objeto que representa el nuevo estado. Este enfoque proporciona varias ventajas clave: (1) elimina las condicionales extensas al encapsular cada variante de comportamiento en su propia clase, (2) hace que las transiciones entre estados sean explícitas y estén centralizadas, (3) facilita la adición de nuevos estados sin modificar el código existente, y (4) permite que los estados compartan comportamiento común a través de herencia. La estructura típica incluye una interfaz o clase abstracta State que define los métodos comunes, clases concretas para cada estado, y una clase Context que mantiene una referencia al estado actual y delega las operaciones a éste.',
    
    applicability: [
      'Cuando el comportamiento de un objeto depende de su estado y debe cambiar en tiempo de ejecución',
      'Cuando hay operaciones con múltiples condicionales que dependen del estado del objeto',
      'Cuando se desea evitar código con muchas condiciones relacionadas con el estado en múltiples métodos',
      'Cuando las transiciones de estado siguen reglas definidas que pueden ser encapsuladas dentro de las clases de estado',
      'Para reducir la complejidad del código cuando hay muchos estados posibles y transiciones entre ellos',
      'Cuando se necesita modelar de forma explícita un ciclo de vida complejo en objetos persistentes',
      'Para implementar máquinas de estado finito donde el comportamiento del sistema cambia completamente según el estado actual',
      'Cuando quieres implementar sistemas reactivos que responden de manera diferente a los mismos eventos según su estado interno',
      'Para objetos que deben cambiar su interfaz visible (métodos disponibles) según su estado, simulando el cambio de clase',
      'En sistemas que requieren validaciones específicas dependientes del estado, donde ciertas operaciones solo son válidas en determinados estados',
      'Para modelar procesos de negocio con flujos de trabajo bien definidos y transiciones controladas entre etapas',
      'Cuando necesitas implementar protocolos de comunicación con estados y transiciones claras'
    ],
    
    consequences: [
      'Organiza el código relacionado con estados específicos en clases separadas, mejorando la cohesión y aplicando el principio de responsabilidad única',
      'Hace las transiciones de estado explícitas y más fáciles de entender',
      'Permite que los estados sean objetos que pueden ser compartidos entre múltiples instancias de contexto',
      'Facilita añadir nuevos estados sin cambiar el contexto ni otros estados existentes, siguiendo el principio abierto/cerrado',
      'Elimina las instrucciones condicionales largas y complejas, mejorando la legibilidad y mantenibilidad',
      'Puede introducir muchas clases pequeñas, aumentando la complejidad estructural del código',
      'Las reglas de transición pueden quedar dispersas entre diferentes clases de estado si no se diseña adecuadamente',
      'Puede dificultar el seguimiento del flujo de control a través de múltiples estados',
      'Permite validaciones específicas según el estado, evitando operaciones inválidas según el estado actual',
      'Simplifica la depuración al hacer más explícito el flujo de control entre estados',
      'Aumenta la testabilidad al poder probar cada estado de forma aislada',
      'Puede crear overhead innecesario si el objeto tiene pocos estados o comportamientos simples',
      'Requiere conocer de antemano todos los posibles estados y transiciones, lo que puede ser restrictivo en sistemas muy dinámicos',
      'Mejora la escalabilidad al permitir evolucionar la máquina de estados sin afectar al código cliente'
    ],
    
    notes: `
      <h3>¿Cuándo DEBES usar el patrón State?</h3>
      <ul>
        <li><strong>Máquinas de estado:</strong> Cuando necesitas implementar una máquina de estados finitos en código orientado a objetos, donde cada estado tiene comportamiento y reglas de transición bien definidos.</li>
        <li><strong>Comportamiento condicional complejo:</strong> Cuando tienes métodos con múltiples ramas condicionales basadas en el estado del objeto y estas empiezan a ser difíciles de mantener o extender.</li>
        <li><strong>Navegación de interfaces:</strong> Para gestionar las diferentes vistas y comportamientos de una interfaz de usuario basada en su estado actual, como las diferentes pantallas en un asistente paso a paso.</li>
        <li><strong>Flujos de trabajo:</strong> Para implementar procesos que atraviesan diferentes estados con transiciones bien definidas, como trámites administrativos, procesamientos de pedidos o aprobaciones con múltiples pasos.</li>
        <li><strong>Objetos con ciclo de vida:</strong> Cuando necesitas modelar objetos que tienen un ciclo de vida complejo con diferentes comportamientos en cada etapa, como documentos en un sistema de gestión documental.</li>
        <li><strong>Sistemas de juego:</strong> Para controlar el comportamiento de elementos del juego según su estado (personajes, enemigos, niveles, etc.) donde el comportamiento cambia radicalmente entre estados.</li>
        <li><strong>Validación contextual:</strong> Cuando las validaciones que se aplican a una operación dependen del estado actual del objeto, permitiendo o denegando operaciones específicas.</li>
        <li><strong>Protocolos de comunicación:</strong> Para implementar protocolos donde cada estado espera ciertos mensajes y responde de forma diferente según la fase actual del protocolo (establecimiento de conexión, negociación, transferencia, finalización).</li>
        <li><strong>Sistemas embebidos:</strong> En sistemas con recursos limitados donde el comportamiento debe cambiar drásticamente según el estado operativo (inicialización, funcionamiento normal, modo de bajo consumo, recuperación de errores).</li>
      </ul>
      
      <h3>Variantes del patrón State:</h3>
      <ul>
        <li><strong>State con transiciones internas:</strong> Donde cada estado determina el siguiente estado en caso de una transición, encapsulando completamente la lógica de cambio de estado.</li>
        <li><strong>State con contexto compartido:</strong> Donde los estados tienen acceso al contexto para consultar o modificar otros aspectos del objeto, permitiendo decisiones más complejas.</li>
        <li><strong>State con jerarquía:</strong> Donde los estados pueden heredar comportamiento de estados base compartiendo comportamiento común, reduciendo duplicación de código.</li>
        <li><strong>State con historial:</strong> Que mantiene un registro de estados anteriores para permitir volver a ellos (combina con Memento), útil para implementar funcionalidad de "deshacer".</li>
        <li><strong>State como Singleton:</strong> Cuando los estados no tienen información de instancia y pueden compartirse entre múltiples contextos, optimizando el uso de memoria.</li>
        <li><strong>State generado:</strong> Estados creados mediante generadores de código o máquinas de estado declarativas, a partir de una definición formal de la máquina de estados.</li>
        <li><strong>State con eventos:</strong> Donde las transiciones son desencadenadas por eventos explícitos que son procesados de manera diferente según el estado actual.</li>
        <li><strong>State con transiciones condicionales:</strong> Donde las transiciones entre estados dependen no solo del evento sino también de condiciones adicionales que se evalúan en tiempo de ejecución.</li>
        <li><strong>State con acciones de entrada/salida:</strong> Donde se definen acciones específicas que se ejecutan al entrar o salir de un estado, independientemente de la transición específica.</li>
        <li><strong>State persistente:</strong> Donde el estado actual y sus datos asociados pueden serializarse para permitir que el objeto se almacene y recupere desde una base de datos o archivo, manteniendo su estado interno.</li>
        <li><strong>State anidado (Hierarchical State Machine):</strong> Donde un estado puede contener su propia máquina de estados interna, permitiendo modelar sistemas complejos con varios niveles de comportamiento.</li>
        <li><strong>State paralelo:</strong> Donde un objeto puede estar simultáneamente en múltiples estados independientes que controlan diferentes aspectos de su comportamiento.</li>
      </ul>
      
      <h3>Ejemplos prácticos en aplicaciones reales:</h3>
      <ul>
        <li><strong>Reproductor multimedia:</strong> Con estados como Reproduciendo, Pausado, Detenido, cada uno con comportamiento específico para las operaciones de control. Por ejemplo:
        <pre>
// Pseudocódigo para un reproductor con patrón State
class MediaPlayer {
  private PlayerState state;
  private URL mediaSource;
  private boolean isBuffering;
  
  public MediaPlayer() {
    this.state = new StoppedState();
    this.state.setContext(this);
  }
  
  public void play() {
    state.play();
  }
  
  public void pause() {
    state.pause();
  }
  
  public void stop() {
    state.stop();
  }
  
  public void changeState(PlayerState newState) {
    this.state = newState;
    this.state.setContext(this);
  }
}

interface PlayerState {
  void setContext(MediaPlayer player);
  void play();
  void pause();
  void stop();
}

class PlayingState implements PlayerState {
  private MediaPlayer player;
  
  public void setContext(MediaPlayer player) {
    this.player = player;
  }
  
  public void play() {
    // Ya está reproduciendo, no hacemos nada
  }
  
  public void pause() {
    // Pausar reproducción
    player.changeState(new PausedState());
  }
  
  public void stop() {
    // Detener reproducción
    player.changeState(new StoppedState());
  }
}
        </pre>
        </li>
        <li><strong>Procesamiento de pedidos:</strong> Gestionando estados como Creado, Pagado, Enviado, Entregado, Cancelado, donde cada estado permite diferentes operaciones.</li>
        <li><strong>Editor de documentos:</strong> Con diferentes modos de edición como Inserción, Selección, Formato, donde cada estado procesa las pulsaciones de teclado y clics de forma diferente.</li>
        <li><strong>Conexiones de red:</strong> Gestionando estados como Desconectado, Conectando, Conectado, Transferencia de datos, con comportamientos específicos para cada operación de red.</li>
        <li><strong>Sistemas de autorización:</strong> Con estados de usuario como Anónimo, Autenticado, Autorizado, Bloqueado, donde cada estado determina las operaciones permitidas.</li>
        <li><strong>Control de juegos:</strong> Para implementar comportamientos de enemigos con estados como Patrullar, Perseguir, Atacar, Huir, con distintas lógicas de movimiento y comportamiento:
        <pre>
// Implementación de IA de enemigo con patrón State
class Enemy {
  private EnemyState currentState;
  private Position position;
  private int health;
  private Player target;
  
  public Enemy() {
    this.currentState = new PatrolState();
    this.currentState.setEnemy(this);
    this.health = 100;
  }
  
  public void update() {
    // Este método se llama en cada frame del juego
    currentState.update();
  }
  
  public void seePlayer(Player player) {
    this.target = player;
    currentState.onPlayerSeen();
  }
  
  public void losePlayerSight() {
    currentState.onPlayerLost();
  }
  
  public void takeDamage(int amount) {
    this.health -= amount;
    if (this.health < 20) {
      // Comportamiento específico cuando la salud es baja
      currentState.onLowHealth();
    }
    currentState.onDamageReceived();
  }
  
  public void changeState(EnemyState newState) {
    this.currentState = newState;
    this.currentState.setEnemy(this);
  }
  
  // Getters, setters y otros métodos...
}

interface EnemyState {
  void setEnemy(Enemy enemy);
  void update();
  void onPlayerSeen();
  void onPlayerLost();
  void onDamageReceived();
  void onLowHealth();
}

class ChaseState implements EnemyState {
  private Enemy enemy;
  
  public void setEnemy(Enemy enemy) {
    this.enemy = enemy;
  }
  
  public void update() {
    // Lógica para perseguir al jugador
    // Calcular ruta hacia el jugador y mover al enemigo
  }
  
  public void onPlayerSeen() {
    // Ya estamos persiguiendo al jugador
  }
  
  public void onPlayerLost() {
    // Cambiar a estado de búsqueda
    enemy.changeState(new SearchState());
  }
  
  public void onDamageReceived() {
    // Posiblemente cambia a estado de ataque
    enemy.changeState(new AttackState());
  }
  
  public void onLowHealth() {
    // Huir cuando la salud es baja
    enemy.changeState(new FleeState());
  }
}
        </pre>
        </li>
        <li><strong>Aplicación de impuestos:</strong> Estados como Borrador, En revisión, Aprobado, Rechazado, con diferentes niveles de edición y validación permitidos.</li>
        <li><strong>Semáforos y sistemas de control:</strong> Implementando la secuencia de estados y transiciones, con comportamientos específicos para cada color/fase.</li>
        <li><strong>Formularios de múltiples pasos:</strong> Donde cada paso representa un estado con diferentes validaciones y opciones disponibles:
        <pre>
// Implementación conceptual de un formulario multi-paso
class MultiStepForm {
  private FormState currentState;
  private Map<String, Object> formData = new HashMap<>();
  
  public MultiStepForm() {
    currentState = new PersonalInfoState();
    currentState.setForm(this);
  }
  
  public void next() {
    currentState.next();
  }
  
  public void previous() {
    currentState.previous();
  }
  
  public void submit() {
    currentState.submit();
  }
  
  public void changeState(FormState newState) {
    currentState = newState;
    currentState.setForm(this);
  }
  
  public void saveData(String key, Object value) {
    formData.put(key, value);
  }
  
  public Object getData(String key) {
    return formData.get(key);
  }
}

class AddressInfoState implements FormState {
  private MultiStepForm form;
  
  public void setForm(MultiStepForm form) {
    this.form = form;
  }
  
  public void next() {
    // Validar datos de dirección antes de avanzar
    if (validateAddressData()) {
      form.changeState(new PaymentInfoState());
    }
  }
  
  public void previous() {
    form.changeState(new PersonalInfoState());
  }
  
  public void submit() {
    // No permitir envío desde este paso intermedio
    showError("Complete todos los pasos antes de enviar");
  }
  
  private boolean validateAddressData() {
    // Lógica de validación específica para la dirección
    return true;
  }
}
        </pre>
        </li>
        <li><strong>Máquinas expendedoras:</strong> Con estados como SinSelección, Seleccionado, Dispensando, Mantenimiento, donde cada estado maneja los eventos de entrada del usuario de manera diferente.</li>
        <li><strong>Aplicaciones de chat:</strong> Con estados como Desconectado, Conectando, Conectado, Escribiendo, En llamada, que determinan las acciones disponibles y cómo se procesan los mensajes entrantes.</li>
      </ul>
      
      <h3>Implementación efectiva del patrón State:</h3>
      <ul>
        <li><strong>Determina quién define las transiciones:</strong> Decide si las transiciones las controla el contexto, los estados, o una combinación de ambos. Cuando los estados controlan las transiciones, la lógica de transición está más encapsulada pero más distribuida.</li>
        <li><strong>Considera estados compartidos:</strong> Para estados sin información de instancia, implementa Singleton o objetos flyweight para reducir el overhead de memoria, especialmente si hay muchas instancias del contexto.</li>
        <li><strong>Maneja transiciones no permitidas:</strong> Define comportamiento claro para cuando se intenta una operación no válida en un estado determinado (lanzar excepciones, ignorar, registrar error, etc.).</li>
        <li><strong>Centraliza la lógica de transición:</strong> Si las reglas de transición son complejas o cambian frecuentemente, considera extraerlas a una tabla de transición o un componente específico.</li>
        <li><strong>Balanza entre herencia y composición:</strong> Usa herencia para estados con comportamiento común, pero prefiere composición para comportamientos que pueden combinarse de diferentes maneras.</li>
        <li><strong>Minimiza dependencia del contexto:</strong> Pasa solo la información necesaria a los métodos de estado, o proporciona interfaces específicas en el contexto para limitar el acoplamiento.</li>
        <li><strong>Considera estados dinámicos:</strong> En algunos casos, los estados pueden generarse dinámicamente o configurarse en tiempo de ejecución, aumentando la flexibilidad del sistema.</li>
        <li><strong>Maneja estado persistente:</strong> Para objetos de larga duración o que requieren persistencia, implementa serialización de estado o mapeo a un formato persistente (como bases de datos).</li>
        <li><strong>Definición formal de la máquina de estados:</strong> Para sistemas complejos, considera definir la máquina de estados formalmente (por ejemplo, mediante una tabla o un DSL) y generar código a partir de esa definición.</li>
        <li><strong>Diseña para extensibilidad:</strong> Prevé la adición de nuevos estados y transiciones. La estructura de clases debe facilitar la incorporación de nuevos estados sin modificar los existentes.</li>
        <li><strong>Documenta la máquina de estados:</strong> Proporciona diagramas y documentación clara sobre los estados posibles y las reglas de transición, especialmente para sistemas complejos.</li>
        <li><strong>Verifica la cobertura de estados:</strong> Asegúrate de que todos los estados manejan todas las operaciones posibles, incluso si es para rechazarlas explícitamente.</li>
      </ul>
      
      <h3>State vs Strategy vs Command vs Template Method:</h3>
      <ul>
        <li><strong>State:</strong> Se centra en cambiar el comportamiento de un objeto cuando cambia su estado interno. El objeto parecerá cambiar su clase. Las transiciones entre estados son parte clave del patrón, y cada estado conoce sus posibles transiciones.</li>
        <li><strong>Strategy:</strong> Define una familia de algoritmos intercambiables para diferentes situaciones. Mientras State maneja cómo un objeto cambia su comportamiento según su estado, Strategy permite elegir diferentes algoritmos independientemente del estado. En Strategy no hay concepto de transición entre estrategias.</li>
        <li><strong>Command:</strong> Encapsula una solicitud como un objeto, permitiendo parametrizar objetos con operaciones. Puede combinarse con State cuando diferentes estados requieren ejecutar diferentes comandos. Command se enfoca en la operación, mientras State se enfoca en el contexto que cambia.</li>
        <li><strong>Template Method:</strong> Define el esqueleto de un algoritmo, permitiendo que las subclases redefinan ciertos pasos. Se diferencia de State en que Template Method usa herencia para variar partes de un algoritmo, mientras State usa composición para cambiar comportamientos completos.</li>
        <li><strong>Visitor:</strong> Permite separar algoritmos de la estructura de objetos sobre la que operan. A diferencia de State que cambia el comportamiento del objeto según su estado interno, Visitor mantiene la estructura pero permite aplicar diferentes operaciones sobre ella.</li>
        <li><strong>Memento:</strong> Se puede combinar con State para guardar el historial de estados y permitir restaurarlos. Mientras State gestiona el comportamiento actual, Memento captura y externaliza el estado interno para recuperarlo posteriormente.</li>
        <li><strong>Observer:</strong> Puede usarse junto con State para notificar a otros objetos cuando un contexto cambia de estado, permitiendo que el sistema reaccione a estos cambios.</li>
      </ul>
    `
  }
};

export default statePattern;
