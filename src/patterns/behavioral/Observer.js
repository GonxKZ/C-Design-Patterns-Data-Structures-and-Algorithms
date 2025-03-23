const observerPattern = {
  id: 'observer',
  name: 'Observer',
  category: 'behavioral',
  description: 'Define una dependencia uno-a-muchos entre objetos, de modo que cuando un objeto cambia su estado, todos sus dependientes son notificados y actualizados automáticamente. Este patrón permite la comunicación flexible entre componentes sin acoplarlos estrechamente, facilitando la implementación de sistemas basados en eventos donde múltiples oyentes pueden reaccionar a cambios en los objetos observados. Promueve diseños de bajo acoplamiento y alta cohesión, ideales para interfaces reactivas y sistemas de eventos.',
  
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
    background: 'El patrón Observer fue formalizado por la Banda de los Cuatro (GoF) y tiene sus raíces en el paradigma de programación basada en eventos. Se inspira en el principio de publicación-suscripción encontrado en periódicos y revistas, donde los suscriptores reciben automáticamente nuevas ediciones. En programación, este patrón representa un mecanismo fundamental para la comunicación asíncrona y desacoplada entre componentes, siendo uno de los patrones más implementados en frameworks y bibliotecas modernas. Sus orígenes se remontan a los primeros sistemas de interfaces gráficas de usuario, donde se necesitaba un mecanismo para actualizar múltiples vistas cuando cambiaban los datos del modelo.',
    
    problem: 'En muchos sistemas, es necesario que varios objetos se mantengan sincronizados con el estado de otro objeto, sin crear un acoplamiento rígido. Por ejemplo, en interfaces de usuario, varios componentes pueden necesitar actualizarse cuando cambia un modelo de datos subyacente. Implementar esto con acoplamiento directo haría que el objeto observado necesitara conocer todos sus observadores, complicando el mantenimiento, la extensibilidad y la reutilización. Además, el problema se agrava cuando los componentes pertenecen a diferentes capas de la aplicación, o cuando el número de dependientes puede cambiar dinámicamente. Si un objeto debe comunicarse con muchos otros, esto puede llevar a dependencias rígidas y código frágil que se rompe cuando cambia la estructura de los componentes.',
    
    solution: 'El patrón Observer resuelve este problema definiendo una relación uno-a-muchos entre un objeto "sujeto" (también llamado "observable" o "publicador") y múltiples objetos "observadores" (o "suscriptores"). El sujeto mantiene una lista de sus dependientes (los observadores) y les notifica automáticamente cualquier cambio en su estado, generalmente llamando a un método específico que ellos implementan. Esto permite que el sujeto envíe actualizaciones a sus observadores sin conocer quiénes son concretamente, facilitando una comunicación desacoplada. El patrón proporciona dos variantes principales para implementar las notificaciones: "push", donde el sujeto envía datos detallados con la notificación, y "pull", donde sólo notifica el cambio y los observadores solicitan los datos específicos que necesitan. Esta estructura permite añadir y eliminar observadores en tiempo de ejecución sin modificar el sujeto, promoviendo la extensibilidad y reutilización. Además, separa claramente la lógica del modelo (sujeto) de la lógica que reacciona a sus cambios (observadores), siguiendo el principio de responsabilidad única.',
    
    applicability: [
      'Cuando un cambio en un objeto requiere cambios en otros, y no sabes cuántos objetos necesitan cambiar o quiénes son',
      'Cuando un objeto debe notificar a otros sin hacer suposiciones sobre quiénes son esos objetos',
      'Cuando una abstracción tiene dos aspectos interdependientes, donde los cambios en uno requieren cambios en el otro',
      'Cuando quieres establecer relaciones dinámicas entre objetos en tiempo de ejecución',
      'En arquitecturas que requieren comunicación entre capas o componentes que deben mantenerse desacoplados',
      'Cuando implementas sistemas basados en eventos donde varios receptores pueden responder a un mismo evento',
      'En interfaces de usuario donde múltiples elementos deben reflejar cambios en un modelo de datos subyacente',
      'Cuando necesitas implementar mecanismos de callback con múltiples receptores',
      'En sistemas distribuidos donde diferentes componentes deben sincronizarse en respuesta a cambios',
      'Para implementar sistemas de propagación de cambios a través de una estructura de objetos',
      'En aplicaciones donde las reglas de actualización pueden cambiar dinámicamente',
      'Para separar la lógica de detección de cambios de la lógica que responde a esos cambios'
    ],
    
    consequences: [
      'Facilita el bajo acoplamiento entre objetos que interactúan pero tienen independencia funcional',
      'Permite enviar datos a múltiples objetos de forma sencilla sin modificar el emisor o los receptores',
      'Apoya el principio Open/Closed: puedes añadir nuevos observadores sin modificar el sujeto',
      'Las relaciones entre objetos pueden establecerse en tiempo de ejecución',
      'Puede introducir notificaciones inesperadas o difíciles de seguir si no se gestiona correctamente',
      'Los observadores pueden ser notificados en un orden no determinista',
      'Potencial para fugas de memoria si los observadores no se desregistran adecuadamente',
      'Riesgo de actualizaciones en cascada si los observadores también actúan como sujetos',
      'Posibles problemas de rendimiento si hay muchos observadores o las notificaciones son frecuentes',
      'Mayor complejidad en la depuración debido a la naturaleza indirecta de las actualizaciones',
      'Posible inconsistencia temporal durante la propagación de notificaciones en sistemas multihilo',
      'Riesgo de ciclos de actualización infinitos si los observadores modifican el estado del sujeto',
      'Añade sobrecarga indirecta que puede no ser necesaria para relaciones simples uno-a-uno'
    ],
    
    notes: `
      <h3>¿Cuándo DEBES usar el patrón Observer?</h3>
      <ul>
        <li><strong>Interfaces de usuario:</strong> Para separar la lógica de presentación de los datos del modelo, como en el patrón Model-View-Controller (MVC) donde las vistas observan cambios en el modelo. Este es uno de los usos más comunes y permite que múltiples vistas diferentes se mantengan sincronizadas con el mismo modelo de datos sin acoplamiento directo.</li>
        <li><strong>Sistemas de eventos:</strong> Para implementar sistemas de manejo de eventos donde diferentes componentes pueden reaccionar a los mismos eventos sin conocerse mutuamente. Por ejemplo, en una aplicación de comercio electrónico, cuando se realiza una compra, varios módulos independientes (inventario, facturación, envío, notificaciones) pueden necesitar responder.</li>
        <li><strong>Distribución de datos en tiempo real:</strong> Para actualizar múltiples componentes cuando los datos cambian, como en aplicaciones de bolsa, monitoreo o dashboards. Especialmente útil cuando hay muchas visualizaciones diferentes del mismo conjunto de datos.</li>
        <li><strong>Validación de datos distribuida:</strong> Cuando múltiples validadores o procesadores deben actuar sobre los mismos datos independientemente. Por ejemplo, diferentes reglas de negocio aplicadas a un mismo formulario sin que tengan que conocerse entre sí.</li>
        <li><strong>Propagación de cambios de configuración:</strong> Para notificar a múltiples componentes cuando cambian parámetros de configuración. Esto permite que diferentes partes del sistema reaccionen a cambios sin necesidad de reiniciar o de tener un acoplamiento directo.</li>
        <li><strong>Sincronización de objetos distribuidos:</strong> Para mantener sincronizados objetos en diferentes partes de un sistema, como en aplicaciones colaborativas, editores multiusuario o juegos online donde el estado debe reflejarse en todos los clientes.</li>
        <li><strong>Implementación de middleware:</strong> Para crear capas de middleware que observan y procesan eventos o solicitudes, permitiendo añadir funcionalidades como logging, seguridad o transformación de datos sin modificar el código principal.</li>
        <li><strong>Flujos de trabajo (workflows):</strong> Para implementar sistemas donde diferentes acciones deben desencadenarse al completarse ciertas etapas, permitiendo que los flujos se configuren y modifiquen sin cambiar el código base.</li>
      </ul>
      
      <h3>Variantes del patrón Observer:</h3>
      <ul>
        <li><strong>Push vs Pull:</strong> En el modelo "push", el sujeto envía datos detallados con la notificación, lo que simplifica a los observadores pero puede enviar datos innecesarios. En el modelo "pull", el sujeto solo notifica el cambio y los observadores solicitan los datos específicos que necesitan, lo que es más eficiente pero añade complejidad.</li>
        <li><strong>Event Bus / Message Broker:</strong> Una implementación centralizada donde los sujetos publican eventos en un "bus" y los observadores se suscriben a eventos específicos. Esta variante añade una capa de indirección que ayuda a desacoplar completamente emisores de receptores, y es la base de muchos frameworks modernos de mensajería como Redux, RxJS o sistemas de eventos en microservicios.</li>
        <li><strong>Distribución selectiva:</strong> Donde los observadores pueden registrar interés solo en ciertos tipos de cambios o eventos, permitiendo notificaciones más específicas y reduciendo actualizaciones innecesarias. Implementado frecuentemente con sistemas de filtrado o patrones de coincidencia.</li>
        <li><strong>Observador con prioridad:</strong> Donde los observadores tienen diferentes prioridades que determinan el orden en que son notificados. Útil cuando algunos observadores deben procesar los cambios antes que otros, o cuando se requiere garantías de secuencia.</li>
        <li><strong>Listeners con lambda/callbacks:</strong> Implementaciones modernas que utilizan funciones anónimas, lambdas o closures en lugar de interfaces formales para los observadores, simplificando el código en lenguajes que soportan funciones de primera clase.</li>
        <li><strong>Observer desenchufable (Disposable Observer):</strong> Una variante que devuelve un objeto "suscripción" cuando un observador se registra, permitiendo una fácil gestión del ciclo de vida y desregistro automático cuando ya no se necesita la suscripción.</li>
        <li><strong>Reactive Programming:</strong> Una extensión avanzada del patrón Observer que trata los flujos de eventos como colecciones que pueden ser transformadas, filtradas y combinadas usando operadores funcionales. Implementada en bibliotecas como RxJS, ReactiveX, o frameworks reactivos como Vue.js o MobX.</li>
        <li><strong>Observer con historia (Replay Subject):</strong> Una variante que almacena notificaciones anteriores y puede reproducirlas para nuevos observadores, asegurando que todos reciban la misma secuencia de eventos incluso si se suscriben tarde.</li>
        <li><strong>Weak References:</strong> Implementación que usa referencias débiles a los observadores para evitar problemas de fugas de memoria, permitiendo que los observadores sean recogidos por el recolector de basura cuando ya no tienen otras referencias.</li>
      </ul>
      
      <h3>Ejemplos prácticos en aplicaciones reales:</h3>
      <ul>
        <li><strong>Frameworks UI:</strong> Los componentes de interfaz de usuario en frameworks como React, Angular o Vue utilizan observadores para mantener la vista sincronizada con el modelo:</li>
        <pre>
// Ejemplo simplificado de React/Redux
// El componente se suscribe a cambios en el store
const mapStateToProps = state => ({
  username: state.user.name,
  isLoggedIn: state.auth.loggedIn
});

// El componente se actualiza automáticamente cuando el estado cambia
connect(mapStateToProps)(UserProfileComponent);
        </pre>
        <li><strong>Sistemas de eventos DOM:</strong> En navegadores web, el DOM utiliza listeners de eventos como una forma de patrón Observer:</li>
        <pre>
// Observer en JavaScript nativo (DOM)
document.getElementById('button').addEventListener('click', function() {
  console.log('Botón clickeado');
});
        </pre>
    
        <li><strong>Procesamiento reactivo:</strong> Bibliotecas como RxJS, Project Reactor, o Combine implementan Observer de manera avanzada para manejar flujos de datos asincrónicos:</li>
        <pre>
// Ejemplo con RxJS
const observable = new Observable(subscriber => {
  subscriber.next('Dato 1');
  setTimeout(() => subscriber.next('Dato 2'), 1000);
  setTimeout(() => subscriber.complete(), 2000);
});

observable.subscribe({
  next: (x) => console.log('Recibido: ' + x),
  error: (err) => console.error('Error: ' + err),
  complete: () => console.log('Finalizado')
});
        </pre>
        
        <li><strong>Sistemas de logging:</strong> Frameworks como Log4j utilizan Observer para permitir múltiples appenders que procesan y escriben los mismos eventos de log en diferentes destinos (consola, archivo, base de datos).</li>
        
        <li><strong>Validación de formularios:</strong> En aplicaciones web, múltiples validadores pueden observar los cambios en un formulario y actualizar el estado de validación:</li>
        <pre>
// Validación de formulario con observers
class FormField {
  constructor() {
    this.observers = [];
    this.value = "";
  }
  
  setValue(newValue) {
    this.value = newValue;
    this.notifyObservers();
  }
  
  addValidator(validator) {
    this.observers.push(validator);
  }
  
  notifyObservers() {
    for (const validator of this.observers) {
      validator.validate(this.value);
    }
  }
}

class EmailValidator {
  constructor(errorElementId) {
    this.errorElement = document.getElementById(errorElementId);
  }
  
  validate(value) {
    const isValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
    this.errorElement.style.display = isValid ? 'none' : 'block';
  }
}
        </pre>
        
        <li><strong>Sincronización en tiempo real:</strong> En aplicaciones colaborativas o juegos multijugador, los clientes observan cambios en el estado del servidor:</li>
        <pre>
// Observer en una aplicación colaborativa
class DocumentEditor {
  constructor(documentId) {
    this.documentId = documentId;
    this.socket = io.connect('/documents');
    
    // Suscripción a cambios remotos (cliente como observador)
    this.socket.on('document:' + documentId + ':update', (change) => {
      this.applyChange(change);
    });
  }
  
  // Cuando el usuario local hace cambios (cliente como sujeto)
  makeChange(change) {
    this.applyChange(change);
    this.socket.emit('document:' + this.documentId + ':update', change);
  }
  
  applyChange(change) {
    // Aplicar el cambio al documento local
    console.log('Aplicando cambio:', change);
  }
}
        </pre>
        
        <li><strong>Monitoreo de sistemas:</strong> En infraestructuras de servidores, múltiples monitores observan el estado y métricas de servicios para detectar problemas o desencadenar alarmas.</li>
        
        <li><strong>Sensores y IoT:</strong> Dispositivos IoT como sensores publican sus lecturas a un broker, y múltiples aplicaciones o servicios se suscriben para procesar estos datos.</li>
      </ul>
      
      <h3>Implementación efectiva:</h3>
      <ul>
        <li><strong>Gestión de memoria:</strong> Asegúrate de que los observadores se desregistren correctamente cuando ya no sean necesarios. Considera usar referencias débiles o suscripciones cancelables para evitar fugas de memoria.</li>
        <li><strong>Notificación eficiente:</strong> Implementa mecanismos para evitar notificaciones redundantes cuando ocurren múltiples cambios consecutivos, como técnicas de batching o throttling para agrupar actualizaciones.</li>
        <li><strong>Prevención de ciclos:</strong> Ten cuidado con las actualizaciones en cascada donde un observador modifica el estado del sujeto, lo que podría desencadenar nuevas notificaciones y crear ciclos infinitos.</li>
        <li><strong>Diseño de interfaces:</strong> Diseña interfaces de observadores claras y cohesivas. Si un sujeto tiene múltiples tipos de eventos, considera usar diferentes interfaces de observador para cada tipo.</li>
        <li><strong>Orden de notificación:</strong> Si el orden de notificación es importante, implementa un mecanismo para asegurar que los observadores son notificados en el orden correcto.</li>
        <li><strong>Estado consistente:</strong> Asegúrate de que el sujeto está en un estado consistente antes de notificar a los observadores. Esto es especialmente importante en entornos multihilo.</li>
        <li><strong>Distribución asíncrona:</strong> En sistemas con muchos observadores o donde las notificaciones pueden ser costosas, considera enviar notificaciones en un hilo separado o usar una cola de eventos.</li>
        <li><strong>Filtrado de eventos:</strong> Implementa mecanismos para que los observadores reciban solo los eventos que les interesan, reduciendo procesamiento innecesario.</li>
        <li><strong>Testing adecuado:</strong> Prueba exhaustivamente las interacciones entre sujetos y observadores, especialmente en escenarios complejos como la adición/eliminación de observadores durante las notificaciones o la notificación en entornos multihilo.</li>
        <li><strong>Documentación clara:</strong> Documenta claramente el ciclo de vida de las suscripciones y cómo deben gestionarse, especialmente en equipos grandes donde diferentes desarrolladores pueden crear sujetos y observadores.</li>
      </ul>
      
      <h3>Observer vs Publish-Subscribe vs Mediator vs Callback:</h3>
      <ul>
        <li><strong>Observer:</strong> Define una relación directa uno-a-muchos entre un sujeto y sus observadores. Los observadores conocen al sujeto y se registran directamente con él.</li>
        <li><strong>Publish-Subscribe:</strong> Es similar a Observer pero añade una capa intermedia (el broker/bus de eventos) que desacopla completamente a publicadores y suscriptores. Los publicadores no conocen a los suscriptores y viceversa, solo conocen los canales o tipos de eventos.</li>
        <li><strong>Mediator:</strong> Centraliza la comunicación entre diferentes objetos en un objeto mediador, reduciendo las dependencias directas entre ellos. Mientras Observer enfoca en distribución uno-a-muchos, Mediator coordina muchos-a-muchos.</li>
        <li><strong>Callback:</strong> Es un mecanismo más simple donde se pasa una función como parámetro para ser ejecutada cuando ocurre un evento. Observer es una generalización de callbacks que permite múltiples receptores y una estructura más formal.</li>
        <li><strong>Chain of Responsibility:</strong> Mientras Observer distribuye un evento a múltiples receptores simultáneamente, Chain of Responsibility pasa una solicitud secuencialmente a lo largo de una cadena hasta que uno la maneje.</li>
        <li><strong>Event Sourcing:</strong> Un patrón relacionado que guarda todos los cambios de estado como secuencia de eventos, permitiendo reconstituir el estado actual o pasado. Puede utilizar Observer para notificar a los componentes interesados sobre nuevos eventos.</li>
      </ul>
    `
  },
  
  notes: 'El patrón Observer es uno de los más utilizados en programación moderna, especialmente con el auge de la programación reactiva y basada en eventos. Es fundamental en la implementación de arquitecturas como MVC, MVVM, Redux o Flux. Al implementarlo, es crucial gestionar adecuadamente el ciclo de vida de los observadores para evitar fugas de memoria, especialmente en aplicaciones de larga duración. En sistemas con muchos observadores o alta frecuencia de actualización, considera optimizaciones como agrupación de notificaciones, notificaciones selectivas o estructuras de datos eficientes para la gestión de observadores. Para sistemas distribuidos, considera implementaciones más robustas como Event Bus o sistemas de mensajería que manejen aspectos adicionales como garantía de entrega, persistencia de eventos y balanceo de carga.'
};

export default observerPattern;
