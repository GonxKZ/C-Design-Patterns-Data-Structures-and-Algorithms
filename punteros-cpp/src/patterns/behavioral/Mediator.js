const mediatorPattern = {
  id: 'mediator',
  name: 'Mediator',
  category: 'behavioral',
  description: 'El patrón Mediator define un objeto que encapsula cómo un conjunto de objetos interactúan entre sí, promoviendo el acoplamiento débil y evitando que los objetos se refieran explícitamente unos a otros.',
  
  theory: {
    background: 'En sistemas complejos, los objetos suelen tener muchas conexiones directas entre sí, lo que dificulta su mantenimiento y reutilización.',
    problem: 'Cuando tienes muchos objetos que necesitan comunicarse entre sí, las dependencias directas generan un código muy acoplado y difícil de mantener.',
    solution: 'El Mediator centraliza la comunicación entre componentes a través de un objeto intermediario, reduciendo las dependencias directas.',
    applicability: [
      'Cuando un conjunto de objetos se comunican de formas complejas y bien definidas',
      'Cuando es difícil reutilizar un objeto porque se refiere y comunica con muchos otros objetos',
      'Cuando el comportamiento distribuido entre varias clases debería ser personalizable sin demasiada herencia'
    ],
    consequences: [
      'Reduce el acoplamiento entre componentes del sistema',
      'Centraliza el control de la interacción entre objetos',
      'Simplifica los protocolos de comunicación entre objetos',
      'El mediador puede volverse demasiado complejo si absorbe demasiada funcionalidad'
    ]
  },
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>
#include <vector>
#include <memory>

// Declaración adelantada
class Mediator;

// Interfaz Colleague
class Colleague {
protected:
    Mediator* mediator;
    std::string name;

public:
    Colleague(Mediator* mediator, const std::string& name) 
        : mediator(mediator), name(name) {}
    
    virtual ~Colleague() {}
    
    const std::string& getName() const {
        return name;
    }
    
    virtual void send(const std::string& message) = 0;
    virtual void receive(const std::string& message, const std::string& from) = 0;
};

// Interfaz Mediator
class Mediator {
public:
    virtual ~Mediator() {}
    virtual void addColleague(Colleague* colleague) = 0;
    virtual void sendMessage(const std::string& message, Colleague* sender) = 0;
};

// ConcreteColleague
class ConcreteColleague : public Colleague {
public:
    ConcreteColleague(Mediator* mediator, const std::string& name) 
        : Colleague(mediator, name) {}
    
    void send(const std::string& message) override {
        std::cout << name << " envía: " << message << std::endl;
        mediator->sendMessage(message, this);
    }
    
    void receive(const std::string& message, const std::string& from) override {
        std::cout << name << " recibe de " << from << ": " << message << std::endl;
    }
};

// ConcreteMediator
class ConcreteMediator : public Mediator {
private:
    std::vector<Colleague*> colleagues;

public:
    void addColleague(Colleague* colleague) override {
        colleagues.push_back(colleague);
    }
    
    void sendMessage(const std::string& message, Colleague* sender) override {
        for (auto colleague : colleagues) {
            if (colleague != sender) {
                colleague->receive(message, sender->getName());
            }
        }
    }
};

// Demostración del patrón Mediator
int main() {
    // Crear el mediador
    ConcreteMediator mediator;
    
    // Crear colegas
    ConcreteColleague colega1(&mediator, "Colega 1");
    ConcreteColleague colega2(&mediator, "Colega 2");
    ConcreteColleague colega3(&mediator, "Colega 3");
    
    // Registrar colegas con el mediador
    mediator.addColleague(&colega1);
    mediator.addColleague(&colega2);
    mediator.addColleague(&colega3);
    
    // Enviar mensajes
    colega1.send("Hola a todos desde el Colega 1");
    colega2.send("¿Cómo están? - Colega 2");
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas estándar necesarias.' },
        { line: 6, text: 'Declaramos adelantada la clase Mediator para poder referenciarla desde Colleague.' },
        { line: 9, text: 'La clase base Colleague representa a los objetos que se comunicarán a través del mediador.' },
        { line: 11, text: 'Cada colega tiene una referencia al mediador y un nombre para identificarse.' },
        { line: 14, text: 'El constructor inicializa el mediador y el nombre del colega.' },
        { line: 22, text: 'El método send permite a un colega enviar un mensaje a través del mediador.' },
        { line: 23, text: 'El método receive permite a un colega recibir mensajes de otros a través del mediador.' },
        { line: 27, text: 'La interfaz Mediator define métodos para registrar colegas y enviar mensajes entre ellos.' },
        { line: 31, text: 'addColleague registra un colega en el mediador.' },
        { line: 32, text: 'sendMessage distribuye un mensaje entre los colegas registrados.' },
        { line: 36, text: 'ConcreteColleague implementa la interfaz Colleague.' },
        { line: 41, text: 'Al enviar un mensaje, el colega lo imprime y lo pasa al mediador para distribuirlo.' },
        { line: 46, text: 'Al recibir un mensaje, el colega lo imprime con el nombre del remitente.' },
        { line: 52, text: 'ConcreteMediator implementa la interfaz Mediator.' },
        { line: 54, text: 'El mediador mantiene una lista de todos los colegas registrados.' },
        { line: 58, text: 'addColleague añade un colega a la lista.' },
        { line: 62, text: 'sendMessage distribuye el mensaje a todos los colegas excepto al remitente.' },
        { line: 71, text: 'Creamos un mediador concreto.' },
        { line: 74, text: 'Creamos varios colegas, cada uno con una referencia al mediador.' },
        { line: 80, text: 'Registramos cada colega con el mediador.' },
        { line: 85, text: 'Los colegas envían mensajes que el mediador distribuye a los demás.' }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <unordered_map>
#include <functional>
#include <any>

// Mediador basado en eventos con C++ moderno
class EventMediator {
private:
    // Mapa para almacenar callbacks por tipo de evento
    std::unordered_map<std::string, std::vector<std::function<void(std::any)>>> eventHandlers;

public:
    // Registrar un manejador para un tipo de evento
    template<typename Func>
    void subscribe(const std::string& eventType, Func&& handler) {
        eventHandlers[eventType].push_back(
            std::forward<Func>(handler)
        );
    }
    
    // Publicar un evento con datos
    template<typename T>
    void publish(const std::string& eventType, const T& data) {
        std::cout << "Publicando evento: " << eventType << std::endl;
        
        if (eventHandlers.find(eventType) != eventHandlers.end()) {
            for (auto& handler : eventHandlers[eventType]) {
                handler(data);
            }
        }
    }
};

// Componente que usa el mediador
class Component {
protected:
    std::shared_ptr<EventMediator> mediator;
    std::string name;
    
public:
    Component(std::shared_ptr<EventMediator> mediator, std::string name) 
        : mediator(mediator), name(name) {}
    
    virtual ~Component() = default;
    
    const std::string& getName() const {
        return name;
    }
};

// Componente de chat
class ChatComponent : public Component {
public:
    ChatComponent(std::shared_ptr<EventMediator> mediator, std::string name) 
        : Component(mediator, name) {
        // Suscribirse al evento de chat
        mediator->subscribe<std::pair<std::string, std::string>>(
            "ChatMessage",
            [this](std::any data) {
                auto [sender, message] = std::any_cast<std::pair<std::string, std::string>>(data);
                if (sender != this->name) {
                    this->receiveMessage(sender, message);
                }
            }
        );
    }
    
    void sendMessage(const std::string& message) {
        std::cout << name << " envía: " << message << std::endl;
        // Publicar el mensaje en el mediador
        mediator->publish("ChatMessage", std::make_pair(name, message));
    }
    
    void receiveMessage(const std::string& from, const std::string& message) {
        std::cout << name << " recibe de " << from << ": " << message << std::endl;
    }
};

// Demostración del patrón Mediator usando C++ moderno
int main() {
    // Crear el mediador compartido
    auto mediator = std::make_shared<EventMediator>();
    
    // Crear componentes de chat
    auto chat1 = std::make_shared<ChatComponent>(mediator, "Usuario 1");
    auto chat2 = std::make_shared<ChatComponent>(mediator, "Usuario 2");
    auto chat3 = std::make_shared<ChatComponent>(mediator, "Usuario 3");
    
    // Enviar mensajes a través del mediador
    chat1->sendMessage("Hola a todos desde Usuario 1");
    chat2->sendMessage("Hola, ¿cómo están? - Usuario 2");
    chat3->sendMessage("¡Todo bien por aquí! - Usuario 3");
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas necesarias, incluyendo unordered_map, functional y any para implementar el mediador basado en eventos.' },
        { line: 9, text: 'Creamos una clase EventMediator que implementa el patrón Mediator usando un enfoque basado en eventos.' },
        { line: 11, text: 'Usamos un unordered_map para almacenar callbacks por tipo de evento.' },
        { line: 16, text: 'El método subscribe permite a los componentes registrar handlers para eventos específicos.' },
        { line: 17, text: 'Usamos templates para aceptar cualquier tipo de función como handler.' },
        { line: 23, text: 'El método publish envía eventos a todos los manejadores registrados.' },
        { line: 24, text: 'Usamos templates para aceptar cualquier tipo de datos.' },
        { line: 27, text: 'Verificamos si hay manejadores registrados para este tipo de evento.' },
        { line: 34, text: 'La clase base Component tiene una referencia al mediador de eventos.' },
        { line: 43, text: 'ChatComponent es un componente concreto que se comunica a través del mediador.' },
        { line: 47, text: 'En el constructor, nos suscribimos al evento "ChatMessage".' },
        { line: 49, text: 'Utilizamos una lambda para manejar los mensajes recibidos.' },
        { line: 50, text: 'Usamos std::any_cast para convertir los datos del evento al tipo esperado.' },
        { line: 58, text: 'El método sendMessage publica un mensaje en el mediador.' },
        { line: 59, text: 'Imprimimos quién envía el mensaje.' },
        { line: 60, text: 'Publicamos un par con el nombre del remitente y el mensaje.' },
        { line: 64, text: 'El método receiveMessage maneja los mensajes recibidos.' },
        { line: 72, text: 'Creamos un mediador compartido usando std::make_shared.' },
        { line: 75, text: 'Creamos varios componentes de chat que comparten el mismo mediador.' },
        { line: 80, text: 'Los componentes envían mensajes que se distribuyen a través del mediador.' }
      ]
    },
    java: {
      code: `import java.util.*;
import java.util.function.Consumer;

// Interfaz Mediator
interface Mediator {
    void addColleague(Colleague colleague);
    void sendMessage(String message, Colleague sender);
}

// Clase base Colleague
abstract class Colleague {
    protected Mediator mediator;
    protected String name;
    
    public Colleague(Mediator mediator, String name) {
        this.mediator = mediator;
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
    
    public abstract void send(String message);
    public abstract void receive(String message, String from);
}

// Implementación concreta de Colleague
class ConcreteColleague extends Colleague {
    public ConcreteColleague(Mediator mediator, String name) {
        super(mediator, name);
    }
    
    @Override
    public void send(String message) {
        System.out.println(name + " envía: " + message);
        mediator.sendMessage(message, this);
    }
    
    @Override
    public void receive(String message, String from) {
        System.out.println(name + " recibe de " + from + ": " + message);
    }
}

// Implementación concreta de Mediator
class ConcreteMediator implements Mediator {
    private List<Colleague> colleagues = new ArrayList<>();
    
    @Override
    public void addColleague(Colleague colleague) {
        colleagues.add(colleague);
    }
    
    @Override
    public void sendMessage(String message, Colleague sender) {
        for (Colleague colleague : colleagues) {
            if (colleague != sender) {
                colleague.receive(message, sender.getName());
            }
        }
    }
}

// Mediador basado en eventos usando Java moderno
class EventMediator {
    // Mapa para almacenar manejadores de eventos
    private Map<String, List<Consumer<Object>>> eventHandlers = new HashMap<>();
    
    // Registrar un manejador para un tipo de evento
    public <T> void subscribe(String eventType, Consumer<T> handler) {
        eventHandlers.computeIfAbsent(eventType, k -> new ArrayList<>())
            .add((Consumer<Object>) handler);
    }
    
    // Publicar un evento con datos
    public <T> void publish(String eventType, T data) {
        System.out.println("Publicando evento: " + eventType);
        
        if (eventHandlers.containsKey(eventType)) {
            for (Consumer<Object> handler : eventHandlers.get(eventType)) {
                handler.accept(data);
            }
        }
    }
}

// Componente que usa el mediador de eventos
class ChatUser {
    private EventMediator mediator;
    private String name;
    
    public ChatUser(EventMediator mediator, String name) {
        this.mediator = mediator;
        this.name = name;
        
        // Suscribirse a eventos de chat
        mediator.subscribe("ChatMessage", (ChatMessage message) -> {
            if (!message.sender.equals(this.name)) {
                this.receiveMessage(message.sender, message.content);
            }
        });
    }
    
    public void sendMessage(String message) {
        System.out.println(name + " envía: " + message);
        mediator.publish("ChatMessage", new ChatMessage(name, message));
    }
    
    private void receiveMessage(String from, String message) {
        System.out.println(name + " recibe de " + from + ": " + message);
    }
}

// Clase de mensaje para el chat
class ChatMessage {
    public final String sender;
    public final String content;
    
    public ChatMessage(String sender, String content) {
        this.sender = sender;
        this.content = content;
    }
}

// Clase de demostración
public class MediatorDemo {
    public static void main(String[] args) {
        // Demostración con mediador tradicional
        System.out.println("EJEMPLO CON MEDIADOR TRADICIONAL:");
        ConcreteMediator mediator = new ConcreteMediator();
        
        ConcreteColleague colega1 = new ConcreteColleague(mediator, "Colega 1");
        ConcreteColleague colega2 = new ConcreteColleague(mediator, "Colega 2");
        ConcreteColleague colega3 = new ConcreteColleague(mediator, "Colega 3");
        
        mediator.addColleague(colega1);
        mediator.addColleague(colega2);
        mediator.addColleague(colega3);
        
        colega1.send("Hola a todos desde el Colega 1");
        colega2.send("¿Cómo están? - Colega 2");
        
        // Demostración con mediador basado en eventos
        System.out.println("\nEJEMPLO CON MEDIADOR BASADO EN EVENTOS:");
        EventMediator eventMediator = new EventMediator();
        
        ChatUser user1 = new ChatUser(eventMediator, "Usuario 1");
        ChatUser user2 = new ChatUser(eventMediator, "Usuario 2");
        ChatUser user3 = new ChatUser(eventMediator, "Usuario 3");
        
        user1.sendMessage("Hola a todos desde Usuario 1");
        user2.sendMessage("Hola, ¿cómo están? - Usuario 2");
        user3.sendMessage("¡Todo bien por aquí! - Usuario 3");
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos las clases necesarias, incluyendo java.util.function para implementar el mediador basado en eventos.' },
        { line: 4, text: 'Definimos la interfaz Mediator con métodos para registrar colegas y enviar mensajes.' },
        { line: 10, text: 'La clase abstracta Colleague representa a los objetos que se comunicarán a través del mediador.' },
        { line: 14, text: 'El constructor inicializa el mediador y el nombre del colega.' },
        { line: 22, text: 'Los métodos send y receive son abstractos y deben ser implementados por las clases concretas.' },
        { line: 26, text: 'ConcreteColleague implementa la clase abstracta Colleague.' },
        { line: 33, text: 'El método send envía un mensaje a través del mediador.' },
        { line: 38, text: 'El método receive maneja los mensajes recibidos de otros colegas.' },
        { line: 44, text: 'ConcreteMediator implementa la interfaz Mediator.' },
        { line: 45, text: 'El mediador mantiene una lista de colegas para distribuir mensajes.' },
        { line: 54, text: 'sendMessage distribuye el mensaje a todos los colegas excepto al remitente.' },
        { line: 61, text: 'EventMediator es una implementación alternativa usando un enfoque basado en eventos.' },
        { line: 63, text: 'Usamos un mapa para almacenar manejadores de eventos por tipo de evento.' },
        { line: 66, text: 'El método subscribe permite registrar manejadores para tipos de eventos específicos.' },
        { line: 72, text: 'El método publish distribuye un evento a todos los manejadores registrados.' },
        { line: 83, text: 'ChatUser es un componente que utiliza el mediador basado en eventos.' },
        { line: 89, text: 'Nos suscribimos a eventos de chat usando una lambda de Java 8.' },
        { line: 96, text: 'sendMessage publica un mensaje en el mediador usando una clase ChatMessage.' },
        { line: 107, text: 'ChatMessage es una clase sencilla para encapsular mensajes de chat.' },
        { line: 119, text: 'Mostramos dos implementaciones: el mediador tradicional y el basado en eventos.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Acoplamiento',
      cppTraditional: 'Menor acoplamiento que la comunicación directa, pero aún requiere que cada colega conozca su mediador.',
      cppModern: 'Acoplamiento mínimo usando eventos y callbacks, los componentes solo conocen el mediador de eventos, no otros componentes.',
      java: 'Similar al C++ moderno usando listeners de eventos, especialmente con Java 8 y programación funcional.'
    },
    {
      title: 'Flexibilidad',
      cppTraditional: 'Requiere modificar el mediador concreto para cambiar el comportamiento de comunicación.',
      cppModern: 'Alta flexibilidad con el sistema basado en eventos, fácil de extender con nuevos tipos de eventos.',
      java: 'Alta flexibilidad con el enfoque basado en eventos y el uso de Consumer<T>.'
    },
    {
      title: 'Complejidad',
      cppTraditional: 'Implementación relativamente simple con relaciones claras entre colegas y mediador.',
      cppModern: 'Mayor complejidad debido al uso de std::any, lambdas y templates, pero más potente y flexible.',
      java: 'Complejidad media, más sencillo que C++ moderno gracias al sistema de tipos de Java.'
    },
    {
      title: 'Aplicación típica',
      cppTraditional: 'Sistemas con relaciones complejas bien definidas entre objetos.',
      cppModern: 'Arquitecturas basadas en eventos como interfaces de usuario o sistemas de mensajería.',
      java: 'Frameworks de UI como Swing o JavaFX, o sistemas empresariales basados en eventos.'
    }
  ],
  
  notes: 'El patrón Mediator es especialmente útil en interfaces de usuario, donde muchos componentes interactúan entre sí. Frameworks como React utilizan un enfoque similar con el estado centralizado. En sistemas distribuidos, los message brokers como RabbitMQ o Kafka implementan conceptos similares al Mediator a gran escala.'
};

export default mediatorPattern; 