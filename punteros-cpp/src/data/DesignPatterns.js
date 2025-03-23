// Estructura de datos para los patrones de diseño
// Cada patrón incluye versiones para C++ tradicional, C++ moderno y Java

// Importación de patrones individuales
import factoryMethodPattern from '../patterns/creational/FactoryMethod';
import builderPattern from '../patterns/creational/Builder';
import abstractFactory from '../patterns/creational/AbstractFactory';
import prototypePattern from '../patterns/creational/Prototype';
import { adapterPattern } from '../patterns/structural/Adapter';
import { strategyPattern } from '../patterns/behavioral/Strategy';
import compositePattern from '../patterns/structural/Composite';
import decoratorPattern from '../patterns/structural/Decorator';
import proxyPattern from '../patterns/structural/Proxy';
import commandPattern from '../patterns/behavioral/Command';
import observerPattern from '../patterns/behavioral/Observer';
import facadePattern from '../patterns/structural/Facade';
import bridgePattern from '../patterns/structural/Bridge';
import flyweightPattern from '../patterns/structural/Flyweight';
import templateMethodPattern from '../patterns/behavioral/TemplateMethod';
import statePattern from '../patterns/behavioral/State';
import chainOfResponsibilityPattern from '../patterns/behavioral/ChainOfResponsibility';
import iteratorPattern from '../patterns/behavioral/Iterator';
import mediatorPattern from '../patterns/behavioral/Mediator';
import mementoPattern from '../patterns/behavioral/Memento';
import visitorPattern from '../patterns/behavioral/Visitor';
import interpreterPattern from '../patterns/behavioral/Interpreter';
import nullObjectPattern from '../patterns/behavioral/NullObject';
// Patrones arquitectónicos
import mvcPattern from '../patterns/architectural/MVC';
import mvpPattern from '../patterns/architectural/MVP';
import mvvmPattern from '../patterns/architectural/MVVM';
import cleanArchitecturePattern from '../patterns/architectural/CleanArchitecture';
import hexagonalArchitecturePattern from '../patterns/architectural/HexagonalArchitecture';
import eventSourcingPattern from '../patterns/architectural/EventSourcing';
import cqrsPattern from '../patterns/architectural/CQRS';
import microservicesPattern from '../patterns/architectural/Microservices';
import apiGatewayPattern from '../patterns/architectural/APIGateway';
import serviceDiscoveryPattern from '../patterns/architectural/ServiceDiscovery';
import sidecarPattern from '../patterns/architectural/Sidecar';
import backendForFrontendPattern from '../patterns/architectural/BackendForFrontend';
import stranglerFigPattern from '../patterns/architectural/StranglerFig';
import antiCorruptionLayerPattern from '../patterns/architectural/AntiCorruptionLayer';
// Patrones de concurrencia
import threadPoolPattern from '../patterns/concurrency/ThreadPool';
import producerConsumerPattern from '../patterns/concurrency/ProducerConsumer';
import leaderElectionPattern from '../patterns/concurrency/LeaderElection';
// Patrones funcionales
import monadPattern from '../patterns/functional/Monad';
import memoizationPattern from '../patterns/functional/Memoization';
import curryingPattern from '../patterns/functional/Currying';
import compositionPattern from '../patterns/functional/Composition';
import partialApplicationPattern from '../patterns/functional/PartialApplication';
import immutabilityPattern from '../patterns/functional/Immutability';
import pipeFilterPattern from '../patterns/functional/PipeFilter';
// Patrones de acceso a datos
import repositoryPattern from '../patterns/data-access/Repository';
import shardingPattern from '../patterns/data-access/Sharding';
import cacheAsidePattern from '../patterns/data-access/CacheAside';
import unitOfWorkPattern from '../patterns/data-access/UnitOfWork';
import dataMapperPattern from '../patterns/data-access/DataMapper';
import activeRecordPattern from '../patterns/data-access/ActiveRecord';
import daoPattern from '../patterns/data-access/DAO';
import identityMapPattern from '../patterns/data-access/IdentityMap';
import lazyLoadPattern from '../patterns/data-access/LazyLoad';
import queryObjectPattern from '../patterns/data-access/QueryObject';
// Patrones de inversión de control
import dependencyInjectionPattern from '../patterns/ioc/DependencyInjection';
import serviceLocatorPattern from '../patterns/ioc/ServiceLocator';
// Patrones de resiliencia
import circuitBreakerPattern from '../patterns/resilience/CircuitBreaker';
import bulkheadPattern from '../patterns/resilience/Bulkhead';
import retryPattern from '../patterns/resilience/Retry';
import sagaPattern from '../patterns/resilience/Saga';
import throttlingPattern from '../patterns/resilience/Throttling';
import timeoutPattern from '../patterns/resilience/Timeout';

export const patternCategories = [
  {
    id: 'creational',
    name: 'Patrones Creacionales',
    description: 'Estos patrones proporcionan mecanismos de creación de objetos que incrementan la flexibilidad y la reutilización del código existente.'
  },
  {
    id: 'structural',
    name: 'Patrones Estructurales',
    description: 'Estos patrones explican cómo ensamblar objetos y clases en estructuras más grandes, mientras se mantiene la flexibilidad y eficiencia de la estructura.'
  },
  {
    id: 'behavioral',
    name: 'Patrones de Comportamiento',
    description: 'Estos patrones tratan con algoritmos y la asignación de responsabilidades entre objetos.'
  },
  {
    id: 'architectural',
    name: 'Patrones Arquitectónicos',
    description: 'Estos patrones abordan la estructura global de una aplicación, definiendo sus componentes principales y las relaciones entre ellos.'
  },
  {
    id: 'concurrency',
    name: 'Patrones de Concurrencia',
    description: 'Estos patrones resuelven problemas relacionados con la computación paralela, la sincronización y el multihilo.'
  },
  {
    id: 'functional',
    name: 'Patrones Funcionales',
    description: 'Estos patrones aprovechan los principios de la programación funcional, como inmutabilidad, funciones de orden superior y composición para resolver problemas comunes.'
  },
  {
    id: 'data-access',
    name: 'Patrones de Acceso a Datos',
    description: 'Estos patrones proporcionan soluciones para interactuar con fuentes de datos, como bases de datos, servicios web o sistemas de archivos.'
  },
  {
    id: 'ioc',
    name: 'Patrones de Inversión de Control',
    description: 'Estos patrones abordan la inversión del flujo de control en aplicaciones, facilitando la modularidad, extensibilidad y pruebas unitarias.'
  },
  {
    id: 'resilience',
    name: 'Patrones de Resiliencia',
    description: 'Estos patrones mejoran la capacidad de un sistema para manejar fallos, recuperarse de errores y mantener la funcionalidad bajo condiciones adversas.'
  }
];

export const designPatterns = {
  // PATRONES CREACIONALES
  'singleton': {
    id: 'singleton',
    category: 'creational',
    name: 'Singleton',
    description: 'Garantiza que una clase tenga una única instancia y proporciona un punto de acceso global a ella.',
    theory: {
      background: 'En sistemas donde debe existir exactamente una instancia de cierta clase, como un administrador de configuración o un gestor de recursos.',
      problem: 'Necesitas asegurar que una clase tenga solo una instancia y proporcionar un punto de acceso global a ella, evitando la creación múltiple de instancias.',
      solution: 'Hacer privado el constructor de la clase para prevenir la creación múltiple de instancias y proporcionar un método estático que devuelve la única instancia.',
      applicability: [
        'Cuando debe haber exactamente una instancia de una clase, y debe ser accesible a los clientes desde un punto de acceso conocido',
        'Cuando la única instancia debe ser extensible por subclasificación, y los clientes deben poder usar una instancia extendida sin modificar su código'
      ],
      consequences: [
        'Acceso controlado a la única instancia',
        'Reducción del espacio de nombres (evita variables globales)',
        'Permite refinamiento de operaciones y representación',
        'Permite un número variable de instancias si los requisitos cambian',
        'Más flexible que las operaciones de clase estáticas'
      ]
    },
    implementations: {
      cppTraditional: {
        code: `class Singleton {
private:
    static Singleton* instance; // Puntero estático que almacena la única instancia
    
    // Constructor privado para prevenir instanciación directa
    Singleton() {
        // Inicialización
    }
    
    // Evitar copia y asignación
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;
    
public:
    // Método para acceder a la instancia única
    static Singleton* getInstance() {
        if (instance == nullptr) {
            instance = new Singleton();
        }
        return instance;
    }
    
    void someBusinessLogic() {
        // Lógica de negocio
    }
    
    // Destructor
    ~Singleton() {
        // Limpieza de recursos
    }
};

// Inicialización del puntero estático
Singleton* Singleton::instance = nullptr;

// Uso del singleton
void clientCode() {
    Singleton* s1 = Singleton::getInstance();
    Singleton* s2 = Singleton::getInstance();
    
    // s1 y s2 apuntan a la misma instancia
    if (s1 == s2) {
        std::cout << "Singleton funciona, ambas variables contienen la misma instancia." << std::endl;
    }
}`,
        explanation: [
          { line: 1, text: "Definición de la clase Singleton." },
          { line: 2, text: "Sección privada que contiene miembros no accesibles desde fuera de la clase." },
          { line: 3, text: "Declaración de un puntero estático que almacenará la única instancia de la clase." },
          { line: 5, text: "Constructor privado para evitar que se creen instancias desde fuera de la clase." },
          { line: 9, text: "Se elimina el constructor de copia para evitar duplicación del singleton." },
          { line: 10, text: "Se elimina el operador de asignación para prevenir copias del singleton." },
          { line: 13, text: "Sección pública con métodos accesibles desde fuera de la clase." },
          { line: 15, text: "Método estático que devuelve la única instancia de la clase." },
          { line: 16, text: "Comprueba si la instancia ya existe." },
          { line: 17, text: "Si no existe, crea una nueva instancia usando new (asignación dinámica de memoria)." },
          { line: 19, text: "Devuelve un puntero a la instancia única." },
          { line: 22, text: "Método de ejemplo que implementa la lógica de negocio del singleton." },
          { line: 27, text: "Destructor que limpia recursos cuando la instancia es destruida." },
          { line: 32, text: "Inicialización del puntero estático a nullptr." },
          { line: 35, text: "Función de ejemplo que muestra cómo usar el singleton." },
          { line: 36, text: "Obtiene la instancia del singleton." },
          { line: 37, text: "Obtiene nuevamente la instancia, que será la misma que s1." },
          { line: 40, text: "Comprueba que ambos punteros apuntan a la misma instancia." }
        ]
      },
      cppModern: {
        code: `class Singleton {
private:
    // Constructor privado
    Singleton() {}
    
    // Prevenir copia o movimiento
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;
    Singleton(Singleton&&) = delete;
    Singleton& operator=(Singleton&&) = delete;
    
public:
    // Método para acceder a la instancia única
    static Singleton& getInstance() {
        // Instancia estática garantizada por C++11
        static Singleton instance;
        return instance;
    }
    
    void someBusinessLogic() {
        // Lógica de negocio
    }
};

// Uso del singleton
void clientCode() {
    Singleton& s1 = Singleton::getInstance();
    Singleton& s2 = Singleton::getInstance();
    
    // s1 y s2 son referencias a la misma instancia
    if (&s1 == &s2) {
        std::cout << "Singleton funciona, ambas referencias apuntan a la misma instancia." << std::endl;
    }
}`,
        explanation: [
          { line: 1, text: "Definición de la clase Singleton." },
          { line: 2, text: "Sección privada para miembros no accesibles desde fuera." },
          { line: 4, text: "Constructor privado para evitar la creación externa de instancias." },
          { line: 7, text: "Se elimina el constructor de copia para prevenir duplicación." },
          { line: 8, text: "Se elimina el operador de asignación para prevenir copias." },
          { line: 9, text: "Se elimina el constructor de movimiento (C++11) para prevenir transferencia de recursos." },
          { line: 10, text: "Se elimina el operador de asignación por movimiento." },
          { line: 13, text: "Sección pública con métodos accesibles." },
          { line: 15, text: "Método estático que devuelve una referencia a la única instancia." },
          { line: 17, text: "Declaración de una variable estática local. En C++11, su inicialización es thread-safe." },
          { line: 18, text: "Devuelve una referencia a la instancia única, no un puntero." },
          { line: 21, text: "Método de ejemplo que implementa la lógica de negocio del singleton." },
          { line: 27, text: "Función de ejemplo que muestra cómo usar el singleton." },
          { line: 28, text: "Obtiene una referencia a la instancia del singleton, no un puntero." },
          { line: 29, text: "Obtiene otra referencia que apunta a la misma instancia." },
          { line: 32, text: "Comprueba que ambas referencias apuntan a la misma instancia usando el operador de dirección (&)." }
        ]
      },
      java: {
        code: `public class Singleton {
    // Instancia privada y estática
    private static volatile Singleton instance;
    
    // Constructor privado
    private Singleton() {
        // Inicialización
    }
    
    // Método para obtener la instancia (thread-safe con double-checking)
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
    
    public void someBusinessLogic() {
        // Lógica de negocio
    }
}

// Uso del singleton
class Main {
    public static void main(String[] args) {
        Singleton s1 = Singleton.getInstance();
        Singleton s2 = Singleton.getInstance();
        
        // Verificar que son la misma instancia
        if (s1 == s2) {
            System.out.println("Singleton funciona, ambas referencias apuntan a la misma instancia.");
        }
    }
}`,
        explanation: [
          { line: 1, text: "Definición de la clase Singleton en Java." },
          { line: 3, text: "Declaración de una variable estática privada que almacenará la única instancia. El modificador 'volatile' asegura visibilidad correcta entre hilos." },
          { line: 6, text: "Constructor privado para evitar instanciación externa." },
          { line: 11, text: "Método estático para acceder a la instancia única." },
          { line: 12, text: "Primera verificación de si la instancia existe (optimización)." },
          { line: 13, text: "Bloque sincronizado que asegura que solo un hilo puede entrar a la vez." },
          { line: 14, text: "Segunda verificación (patrón 'double-checked locking')." },
          { line: 15, text: "Creación de la instancia si aún no existe." },
          { line: 19, text: "Devolución de la instancia única." },
          { line: 22, text: "Método de ejemplo con la lógica de negocio." },
          { line: 28, text: "Clase principal para mostrar el uso del singleton." },
          { line: 30, text: "Obtiene una referencia a la instancia del singleton." },
          { line: 31, text: "Obtiene otra referencia, que será la misma que s1." },
          { line: 34, text: "Comprueba que ambas referencias apuntan al mismo objeto." }
        ]
      }
    },
    comparisons: [
      {
        title: 'Seguridad en hilos (thread-safety)',
        cppTraditional: 'No es thread-safe por defecto, requiere sincronización explícita.',
        cppModern: 'Variables estáticas locales son thread-safe desde C++11 (inicialización perezosa).',
        java: 'Implementado con double-checked locking y volatile para garantizar thread-safety.'
      },
      {
        title: 'Gestión de memoria',
        cppTraditional: 'Requiere gestión manual de memoria, propenso a fugas si no se maneja correctamente.',
        cppModern: 'No necesita gestión manual, la variable estática se destruye automáticamente.',
        java: 'Gestionado por el recolector de basura de Java.'
      },
      {
        title: 'Inicialización',
        cppTraditional: 'Inicialización perezosa (se crea cuando se solicita por primera vez).',
        cppModern: 'Inicialización perezosa garantizada por el estándar de C++11.',
        java: 'Inicialización perezosa con double-checking para rendimiento.'
      }
    ],
    notes: 'El patrón Singleton es uno de los más simples pero también de los más controvertidos. En sistemas modernos, especialmente en entornos concurrentes, puede causar problemas de acoplamiento y dificultar las pruebas. Alternativas como la inyección de dependencias suelen ser preferibles para sistemas complejos. En C++, las variables estáticas locales ofrecen una forma elegante y thread-safe de implementar singletons desde C++11.'
  },
  'abstract-factory': abstractFactory,
  'factory-method': factoryMethodPattern,
  'builder': builderPattern,
  'prototype': prototypePattern,
  // PATRONES ESTRUCTURALES
  'adapter': adapterPattern,
  'composite': compositePattern,
  'decorator': decoratorPattern,
  'proxy': proxyPattern,
  'facade': facadePattern,
  'bridge': bridgePattern,
  'flyweight': flyweightPattern,
  // PATRONES DE COMPORTAMIENTO
  'strategy': strategyPattern,
  'command': commandPattern,
  'observer': observerPattern,
  'template-method': templateMethodPattern,
  'state': statePattern,
  'chain-of-responsibility': chainOfResponsibilityPattern,
  'iterator': iteratorPattern,
  'mediator': mediatorPattern,
  'memento': mementoPattern,
  'visitor': visitorPattern,
  'interpreter': interpreterPattern,
  'null-object': nullObjectPattern,
  // PATRONES ARQUITECTÓNICOS
  'mvc': mvcPattern,
  'mvp': mvpPattern,
  'mvvm': mvvmPattern,
  'clean-architecture': cleanArchitecturePattern,
  'hexagonal-architecture': hexagonalArchitecturePattern,
  'event-sourcing': eventSourcingPattern,
  'cqrs': cqrsPattern,
  'microservices': microservicesPattern,
  'api-gateway': apiGatewayPattern,
  'service-discovery': serviceDiscoveryPattern,
  'sidecar': sidecarPattern,
  'backend-for-frontend': backendForFrontendPattern,
  'strangler-fig': stranglerFigPattern,
  'anti-corruption-layer': antiCorruptionLayerPattern,
  // PATRONES DE CONCURRENCIA
  'thread-pool': threadPoolPattern,
  'producer-consumer': producerConsumerPattern,
  'leader-election': leaderElectionPattern,
  // PATRONES FUNCIONALES
  'monad': monadPattern,
  'memoization': memoizationPattern,
  'currying': curryingPattern,
  'composition': compositionPattern,
  'partial-application': partialApplicationPattern,
  'immutability': immutabilityPattern,
  'pipe-filter': pipeFilterPattern,
  // PATRONES DE ACCESO A DATOS
  'repository': repositoryPattern,
  'sharding': shardingPattern,
  'cache-aside': cacheAsidePattern,
  'unit-of-work': unitOfWorkPattern,
  'data-mapper': dataMapperPattern,
  'active-record': activeRecordPattern,
  'dao': daoPattern,
  'identity-map': identityMapPattern,
  'lazy-load': lazyLoadPattern,
  'query-object': queryObjectPattern,
  // PATRONES DE INVERSIÓN DE CONTROL
  'dependency-injection': dependencyInjectionPattern,
  'service-locator': serviceLocatorPattern,
  // PATRONES DE RESILIENCIA
  'circuit-breaker': circuitBreakerPattern,
  'bulkhead': bulkheadPattern,
  'retry': retryPattern,
  'saga': sagaPattern,
  'throttling': throttlingPattern,
  'timeout': timeoutPattern
  // Más patrones se irán añadiendo a medida que se creen los archivos correspondientes
};
