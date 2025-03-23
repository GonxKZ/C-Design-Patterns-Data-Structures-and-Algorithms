const observerPattern = {
  id: 'observer',
  name: 'Observer',
  category: 'behavioral',
  description: 'El patrón Observer define una dependencia uno a muchos entre objetos, de modo que cuando un objeto cambia de estado, todos sus dependientes son notificados y actualizados automáticamente.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

// Interfaz para los observadores
class Observer {
public:
    virtual ~Observer() {}
    virtual void update(const std::string& message) = 0;
};

// Sujeto que mantiene una lista de observadores y los notifica
class Subject {
private:
    std::vector<Observer*> observers;
    std::string state;

public:
    void attach(Observer* observer) {
        observers.push_back(observer);
    }

    void detach(Observer* observer) {
        observers.erase(
            std::remove(observers.begin(), observers.end(), observer),
            observers.end()
        );
    }

    void setState(const std::string& newState) {
        state = newState;
        notify();
    }

    const std::string& getState() const {
        return state;
    }

    void notify() {
        for (Observer* observer : observers) {
            observer->update(state);
        }
    }
};

// Observador concreto
class ConcreteObserver : public Observer {
private:
    std::string name;
    Subject* subject;

public:
    ConcreteObserver(Subject* subject, const std::string& name)
        : subject(subject), name(name) {
        this->subject->attach(this);
    }

    ~ConcreteObserver() {
        subject->detach(this);
    }

    void update(const std::string& message) override {
        std::cout << name << " ha recibido: " << message << std::endl;
    }
};

// Uso del patrón Observer
int main() {
    Subject subject;
    
    ConcreteObserver observer1(&subject, "Observer 1");
    ConcreteObserver observer2(&subject, "Observer 2");
    ConcreteObserver observer3(&subject, "Observer 3");
    
    subject.setState("Primer cambio de estado");
    subject.setState("Segundo cambio de estado");
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas necesarias para este patrón.' },
        { line: 6, text: 'Definimos la interfaz Observer que todos los observadores deben implementar.' },
        { line: 8, text: 'El destructor virtual es importante para permitir la correcta destrucción de los observadores derivados.' },
        { line: 9, text: 'El método update es la funcionalidad principal que cada observador debe implementar para recibir actualizaciones.' },
        { line: 13, text: 'La clase Subject mantiene la lista de observadores y maneja su notificación.' },
        { line: 15, text: 'Mantenemos una lista de punteros a Observer y un estado que será notificado.' },
        { line: 19, text: 'El método attach permite registrar un nuevo observador.' },
        { line: 23, text: 'El método detach elimina un observador de la lista.' },
        { line: 24, text: 'std::remove no elimina físicamente el elemento, solo lo mueve al final y devuelve un iterador.' },
        { line: 25, text: 'erase elimina físicamente el elemento usando el iterador devuelto por remove.' },
        { line: 29, text: 'Cuando cambiamos el estado, notificamos a todos los observadores.' },
        { line: 37, text: 'El método notify recorre la lista de observadores y llama a su método update.' },
        { line: 45, text: 'Implementación concreta de un observador.' },
        { line: 52, text: 'En el constructor, nos auto-registramos en el sujeto.' },
        { line: 56, text: 'En el destructor, nos desregistramos del sujeto para evitar punteros colgantes.' },
        { line: 59, text: 'Implementación específica de cómo reaccionar a las actualizaciones.' },
        { line: 65, text: 'Demostración del uso del patrón Observer.' },
        { line: 68, text: 'Creamos varios observadores que se registran automáticamente en el sujeto.' },
        { line: 72, text: 'Cada cambio de estado notifica a todos los observadores registrados.' }
      ]
    },
    
    cppModern: {
      code: `#include <iostream>
#include <vector>
#include <string>
#include <memory>
#include <algorithm>
#include <functional>

// Definición forward para resolver dependencias circulares
class Subject;

// Interfaz para los observadores usando std::shared_ptr
class Observer : public std::enable_shared_from_this<Observer> {
public:
    virtual ~Observer() = default;
    virtual void update(const std::string& message) = 0;
    virtual void setSubject(std::shared_ptr<Subject> subject) = 0;
};

// Sujeto que mantiene una lista de observadores y los notifica
class Subject : public std::enable_shared_from_this<Subject> {
private:
    std::vector<std::weak_ptr<Observer>> observers;
    std::string state;

public:
    void attach(std::shared_ptr<Observer> observer) {
        // Limpiar observadores expirados
        observers.erase(
            std::remove_if(observers.begin(), observers.end(), 
                [](const std::weak_ptr<Observer>& o) { return o.expired(); }),
            observers.end()
        );
        
        // Agregar el nuevo observador
        observers.push_back(observer);
        observer->setSubject(shared_from_this());
    }

    void setState(const std::string& newState) {
        state = newState;
        notify();
    }

    const std::string& getState() const {
        return state;
    }

    void notify() {
        // Notificar solo a observadores que aún existen
        for (auto& weakObserver : observers) {
            if (auto observer = weakObserver.lock()) {
                observer->update(state);
            }
        }
    }
};

// Observador concreto
class ConcreteObserver : public Observer {
private:
    std::string name;
    std::weak_ptr<Subject> subject;

public:
    explicit ConcreteObserver(const std::string& name) : name(name) {}

    void update(const std::string& message) override {
        std::cout << name << " ha recibido: " << message << std::endl;
    }

    void setSubject(std::shared_ptr<Subject> newSubject) override {
        subject = newSubject;
    }
};

// Uso del patrón Observer con punteros inteligentes
int main() {
    auto subject = std::make_shared<Subject>();
    
    auto observer1 = std::make_shared<ConcreteObserver>("Observer 1");
    auto observer2 = std::make_shared<ConcreteObserver>("Observer 2");
    auto observer3 = std::make_shared<ConcreteObserver>("Observer 3");
    
    subject->attach(observer1);
    subject->attach(observer2);
    subject->attach(observer3);
    
    subject->setState("Primer cambio de estado");
    
    // El observador 2 podría ser eliminado
    observer2.reset();
    
    // Solo observer1 y observer3 recibirán esta notificación
    subject->setState("Segundo cambio de estado");
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas necesarias, incluyendo memory para punteros inteligentes.' },
        { line: 8, text: 'Usamos una declaración forward para resolver dependencias circulares.' },
        { line: 11, text: 'La clase Observer hereda de enable_shared_from_this para poder usar shared_from_this().' },
        { line: 13, text: 'Usamos default para el destructor, siguiendo la regla de 5 de C++ moderno.' },
        { line: 15, text: 'Agregamos un método para establecer el sujeto, lo que permite una relación bidireccional segura.' },
        { line: 19, text: 'Subject también hereda de enable_shared_from_this para proporcionar referencias seguras.' },
        { line: 21, text: 'Usamos weak_ptr para los observadores para evitar referencias circulares que causarían fugas de memoria.' },
        { line: 25, text: 'En el método attach, primero limpiamos observadores expirados.' },
        { line: 27, text: 'Usamos remove_if con una lambda para eliminar observadores ya no válidos.' },
        { line: 34, text: 'Establecemos una referencia bidireccional segura usando shared_from_this().' },
        { line: 47, text: 'Cuando notificamos, verificamos primero si el observador todavía existe usando lock().' },
        { line: 48, text: 'lock() intenta convertir un weak_ptr en un shared_ptr, devolviendo nullptr si el objeto ya fue destruido.' },
        { line: 59, text: 'Usamos weak_ptr para almacenar la referencia al sujeto, evitando referencias circulares.' },
        { line: 61, text: 'Constructor explícito para prevenir conversiones implícitas no deseadas.' },
        { line: 71, text: 'En el ejemplo de uso, creamos todos los objetos con make_shared para gestión de memoria eficiente.' },
        { line: 79, text: 'Los observadores ahora deben ser adjuntados explícitamente.' },
        { line: 84, text: 'Demostramos cómo un observador puede ser eliminado y el sujeto maneja esto correctamente.' },
        { line: 87, text: 'La segunda notificación solo llegará a los observadores que aún existen.' }
      ]
    },
    
    java: {
      code: `import java.util.ArrayList;
import java.util.List;

// Interfaz para los observadores
interface Observer {
    void update(String message);
}

// Sujeto observable
class Subject {
    private List<Observer> observers = new ArrayList<>();
    private String state;

    public void attach(Observer observer) {
        observers.add(observer);
    }

    public void detach(Observer observer) {
        observers.remove(observer);
    }

    public void setState(String newState) {
        this.state = newState;
        notifyObservers();
    }

    public String getState() {
        return state;
    }

    private void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(state);
        }
    }
}

// Observador concreto
class ConcreteObserver implements Observer {
    private String name;
    private Subject subject;

    public ConcreteObserver(Subject subject, String name) {
        this.subject = subject;
        this.name = name;
        subject.attach(this);
    }

    @Override
    public void update(String message) {
        System.out.println(name + " ha recibido: " + message);
    }
}

// Ejemplo de uso
public class ObserverDemo {
    public static void main(String[] args) {
        Subject subject = new Subject();
        
        ConcreteObserver observer1 = new ConcreteObserver(subject, "Observer 1");
        ConcreteObserver observer2 = new ConcreteObserver(subject, "Observer 2");
        ConcreteObserver observer3 = new ConcreteObserver(subject, "Observer 3");
        
        subject.setState("Primer cambio de estado");
        
        // Desasociar un observador
        subject.detach(observer2);
        
        subject.setState("Segundo cambio de estado");
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos las clases necesarias para manejar listas.' },
        { line: 4, text: 'En Java definimos una interfaz para los observadores.' },
        { line: 5, text: 'El método update es la única funcionalidad que cada observador debe implementar.' },
        { line: 9, text: 'La clase Subject mantiene la lista de observadores y su estado.' },
        { line: 10, text: 'Usamos ArrayList, que es una implementación eficiente de List para almacenar observadores.' },
        { line: 13, text: 'El método attach registra un nuevo observador.' },
        { line: 17, text: 'El método detach elimina un observador de la lista.' },
        { line: 21, text: 'Al cambiar el estado, notificamos a todos los observadores.' },
        { line: 30, text: 'El método notifyObservers recorre la lista de observadores y llama a su método update.' },
        { line: 38, text: 'Implementación concreta de un observador.' },
        { line: 42, text: 'Constructor que inicializa el observador y lo registra automáticamente con el sujeto.' },
        { line: 48, text: 'Implementación del método update que imprime un mensaje cuando recibe una notificación.' },
        { line: 54, text: 'La clase ObserverDemo muestra el uso del patrón.' },
        { line: 60, text: 'Creamos varios observadores que se registran con el sujeto en su constructor.' },
        { line: 65, text: 'Demostramos cómo un observador puede ser desasociado y dejar de recibir actualizaciones.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Gestión de memoria',
      cppTraditional: 'Usa punteros crudos, lo que puede llevar a fugas de memoria si los observadores no se desregistran correctamente.',
      cppModern: 'Utiliza punteros inteligentes (shared_ptr y weak_ptr) para evitar fugas de memoria y referencias cíclicas.',
      java: 'La memoria es gestionada automáticamente por el recolector de basura de Java.'
    },
    {
      title: 'Robustez',
      cppTraditional: 'Puede tener problemas si un observador es destruido sin desregistrarse del sujeto.',
      cppModern: 'Maneja automáticamente observadores que han sido destruidos usando weak_ptr.',
      java: 'Es robusto por defecto debido al recolector de basura, pero requiere desregistrar observadores explícitamente para evitar notificaciones no deseadas.'
    },
    {
      title: 'Flexibilidad',
      cppTraditional: 'Requiere que las clases concretas hereden de la interfaz Observer.',
      cppModern: 'Puede implementarse utilizando callbacks y lambdas, permitiendo enfoques más flexibles sin herencia.',
      java: 'Usa interfaces, lo que permite a las clases implementar múltiples comportamientos de observador.'
    },
    {
      title: 'Rendimiento',
      cppTraditional: 'Mayor rendimiento debido a menos sobrecarga, pero requiere gestión manual de memoria.',
      cppModern: 'Ligera sobrecarga debido a la gestión de punteros inteligentes, pero con mayor seguridad.',
      java: 'Puede tener sobrecarga del recolector de basura, pero optimizado en implementaciones modernas de JVM.'
    }
  ],
  
  theory: {
    background: 'El patrón Observer es fundamental en la programación basada en eventos y es la base de muchos frameworks de interfaz de usuario. Su concepto proviene de la idea de suscripción, similar a cómo los lectores se suscriben a un periódico o revista.',
    problem: 'Necesitamos un mecanismo para que múltiples objetos sean notificados cuando otro objeto cambia de estado, sin crear un acoplamiento fuerte entre ellos. Por ejemplo, en una interfaz gráfica, varios elementos pueden necesitar actualizarse cuando cambia un modelo de datos subyacente.',
    solution: 'El patrón Observer establece una relación uno-a-muchos entre un objeto (el sujeto) y varios objetos dependientes (observadores). Cuando el sujeto cambia su estado, todos los observadores registrados son notificados automáticamente y pueden actualizarse en consecuencia.',
    applicability: [
      'Cuando un cambio en un objeto requiere cambios en otros, y no sabes cuántos objetos necesitan cambiar.',
      'Cuando un objeto debe ser capaz de notificar a otros sin hacer suposiciones sobre quiénes son estos objetos.',
      'Cuando quieres construir un sistema desacoplado donde los componentes pueden interactuar sin conocerse directamente.',
      'Cuando necesitas implementar un mecanismo de publicación/suscripción en tu aplicación.'
    ],
    consequences: [
      'Desacoplamiento: Los sujetos y observadores pueden variar independientemente.',
      'Comunicación broadcast: Un sujeto puede enviar notificaciones a múltiples observadores con una sola operación.',
      'Actualizaciones inesperadas: Los observadores pueden ser notificados en un orden arbitrario.',
      'Posibles referencias cíclicas: Si no se manejan adecuadamente, pueden ocurrir fugas de memoria (especialmente en C++).',
      'Sobrecarga: Con muchos observadores, el rendimiento puede degradarse durante las notificaciones.'
    ]
  },
  
  notes: 'El patrón Observer es la base de muchos frameworks modernos de interfaz de usuario y arquitecturas reactivas. En C++ moderno, se puede implementar usando señales y slots o bibliotecas como Boost.Signals2. En Java, este patrón está incorporado con la clase Observable y la interfaz Observer en el paquete java.util, aunque están obsoletos desde Java 9 y se recomienda usar alternativas como PropertyChangeListener o implementaciones personalizadas.'
};

export default observerPattern;
