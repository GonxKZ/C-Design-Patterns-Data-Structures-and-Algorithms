const decoratorPattern = {
  id: 'decorator',
  name: 'Decorator',
  category: 'structural',
  description: 'Añade responsabilidades adicionales a un objeto dinámicamente. Los decoradores proporcionan una alternativa flexible a la herencia para extender la funcionalidad, permitiendo envolver objetos con nuevos comportamientos sin modificar su estructura original.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>

// Interfaz Component
class Component {
public:
    virtual ~Component() {}
    virtual std::string operation() const = 0;
};

// Componente concreto
class ConcreteComponent : public Component {
public:
    std::string operation() const override {
        return "ConcreteComponent";
    }
};

// Base decorator
class Decorator : public Component {
protected:
    Component* component_;

public:
    Decorator(Component* component) : component_(component) {}
    
    std::string operation() const override {
        return component_->operation();
    }
};

// Decorador concreto A
class ConcreteDecoratorA : public Decorator {
public:
    ConcreteDecoratorA(Component* component) : Decorator(component) {}
    
    std::string operation() const override {
        return "ConcreteDecoratorA(" + Decorator::operation() + ")";
    }
};

// Decorador concreto B
class ConcreteDecoratorB : public Decorator {
private:
    std::string addedBehavior() const {
        return " con comportamiento B adicional";
    }
    
public:
    ConcreteDecoratorB(Component* component) : Decorator(component) {}
    
    std::string operation() const override {
        return "ConcreteDecoratorB(" + Decorator::operation() + ")" + addedBehavior();
    }
};

// Función cliente que utiliza los componentes
void clientCode(const Component* component) {
    std::cout << "RESULTADO: " << component->operation() << std::endl;
}

// Uso del patrón decorator
int main() {
    // Componente simple
    Component* simple = new ConcreteComponent();
    std::cout << "Cliente: Tengo un componente simple:" << std::endl;
    clientCode(simple);
    
    // Decoramos el componente simple con A
    Component* decorator1 = new ConcreteDecoratorA(simple);
    std::cout << "Cliente: Ahora tengo un componente decorado con A:" << std::endl;
    clientCode(decorator1);
    
    // Decoramos aún más con B
    Component* decorator2 = new ConcreteDecoratorB(decorator1);
    std::cout << "Cliente: Ahora tengo un componente decorado con B:" << std::endl;
    clientCode(decorator2);
    
    // Limpieza de memoria
    delete simple;
    delete decorator1;
    delete decorator2;
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas necesarias para este patrón.' },
        { line: 4, text: 'Definimos la interfaz Component que será implementada tanto por los componentes concretos como por los decoradores.' },
        { line: 6, text: 'El destructor virtual es importante para la correcta destrucción de objetos derivados.' },
        { line: 7, text: 'La operación es el método principal que todos los componentes deben implementar.' },
        { line: 11, text: 'Implementación concreta del componente base sin decoradores.' },
        { line: 13, text: 'Implementación básica de la operación que devuelve una cadena identificando al componente.' },
        { line: 18, text: 'La clase Decorator es la base para todos los decoradores y actúa como wrapper para un componente.' },
        { line: 20, text: 'Almacenamos una referencia al componente que estamos decorando.' },
        { line: 23, text: 'El constructor acepta un componente que será decorado.' },
        { line: 25, text: 'La implementación base de operation simplemente delega la llamada al componente envuelto.' },
        { line: 31, text: 'ConcreteDecoratorA es un decorador específico que añade funcionalidad.' },
        { line: 34, text: 'Sobrescribe operation para añadir su comportamiento antes y después de llamar al componente decorado.' },
        { line: 40, text: 'ConcreteDecoratorB es otro decorador con su propia funcionalidad adicional.' },
        { line: 42, text: 'Este decorador incluye un método privado que añade comportamiento extra.' },
        { line: 51, text: 'El cliente utiliza los componentes a través de la interfaz Component, sin preocuparse si está decorado o no.' },
        { line: 56, text: 'En el ejemplo de uso, creamos un componente simple primero.' },
        { line: 61, text: 'Luego decoramos el componente simple con ConcreteDecoratorA.' },
        { line: 66, text: 'Añadimos otra capa de decoración con ConcreteDecoratorB, demostrando cómo se pueden apilar.' },
        { line: 71, text: 'Es importante liberar la memoria asignada dinámicamente para evitar fugas.' }
      ]
    },
    
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <memory>
#include <functional>

// Interfaz Component
class Component {
public:
    virtual ~Component() = default;
    virtual std::string operation() const = 0;
};

// Componente concreto
class ConcreteComponent : public Component {
public:
    std::string operation() const override {
        return "ConcreteComponent";
    }
};

// Base decorator usando punteros inteligentes
class Decorator : public Component {
protected:
    std::shared_ptr<Component> component_;

public:
    explicit Decorator(std::shared_ptr<Component> component) 
        : component_(std::move(component)) {}
    
    std::string operation() const override {
        return component_->operation();
    }
};

// Decorador concreto A
class ConcreteDecoratorA : public Decorator {
public:
    explicit ConcreteDecoratorA(std::shared_ptr<Component> component) 
        : Decorator(std::move(component)) {}
    
    std::string operation() const override {
        return "ConcreteDecoratorA(" + Decorator::operation() + ")";
    }
};

// Decorador concreto B
class ConcreteDecoratorB : public Decorator {
private:
    std::string addedBehavior() const {
        return " con comportamiento B adicional";
    }
    
public:
    explicit ConcreteDecoratorB(std::shared_ptr<Component> component) 
        : Decorator(std::move(component)) {}
    
    std::string operation() const override {
        return "ConcreteDecoratorB(" + Decorator::operation() + ")" + addedBehavior();
    }
};

// Implementación funcional del patrón decorator usando funciones de orden superior
std::function<std::string()> functionalDecorator(
    std::function<std::string()> operation,
    const std::function<std::string(std::string)>& decorator) {
    return [=]() { return decorator(operation()); };
}

// Función cliente que utiliza los componentes
void clientCode(const std::shared_ptr<Component>& component) {
    std::cout << "RESULTADO: " << component->operation() << std::endl;
}

// Uso del patrón decorator con punteros inteligentes
int main() {
    // Componente simple
    auto simple = std::make_shared<ConcreteComponent>();
    std::cout << "Cliente: Tengo un componente simple:" << std::endl;
    clientCode(simple);
    
    // Decoramos el componente simple con A
    auto decorator1 = std::make_shared<ConcreteDecoratorA>(simple);
    std::cout << "Cliente: Ahora tengo un componente decorado con A:" << std::endl;
    clientCode(decorator1);
    
    // Decoramos aún más con B
    auto decorator2 = std::make_shared<ConcreteDecoratorB>(decorator1);
    std::cout << "Cliente: Ahora tengo un componente decorado con B:" << std::endl;
    clientCode(decorator2);
    
    // Ejemplo de decorador funcional
    std::cout << "\\nEnfoque funcional del patrón Decorator:" << std::endl;
    
    // Base operation
    auto op = []() -> std::string { return "ConcreteComponent"; };
    
    // Decorators
    auto decorA = [](std::string s) { return "ConcreteDecoratorA(" + s + ")"; };
    auto decorB = [](std::string s) { return "ConcreteDecoratorB(" + s + ") con comportamiento B adicional"; };
    
    // Componer decoradores
    auto decoratedOp1 = functionalDecorator(op, decorA);
    auto decoratedOp2 = functionalDecorator(decoratedOp1, decorB);
    
    std::cout << "RESULTADO: " << decoratedOp2() << std::endl;
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas necesarias, incluyendo memory para punteros inteligentes y functional para lambdas.' },
        { line: 8, text: 'Usamos default para el destructor, siguiendo la regla de 5 de C++ moderno.' },
        { line: 21, text: 'La clase Decorator ahora usa shared_ptr en lugar de punteros crudos para gestión automática de memoria.' },
        { line: 25, text: 'Constructor marcado como explicit para prevenir conversiones implícitas no deseadas.' },
        { line: 26, text: 'Usamos std::move para transferir la propiedad del puntero, evitando copias innecesarias.' },
        { line: 35, text: 'Los decoradores concretos también usan shared_ptr y move semantics para mejor rendimiento.' },
        { line: 57, text: 'Implementamos una versión funcional del patrón usando funciones de orden superior y lambdas.' },
        { line: 58, text: 'Esta función toma una operación base y un decorador, devolviendo una nueva función que aplica el decorador.' },
        { line: 65, text: 'El cliente ahora recibe shared_ptr, eliminando la necesidad de gestionar la memoria manualmente.' },
        { line: 71, text: 'Usamos make_shared que es más eficiente que crear shared_ptr con new.' },
        { line: 86, text: 'Demostramos el enfoque funcional del patrón Decorator usando lambdas.' },
        { line: 89, text: 'Definimos una operación base como una lambda.' },
        { line: 92, text: 'Definimos decoradores como lambdas que transforman cadenas.' },
        { line: 96, text: 'Componemos los decoradores, encadenándolos para formar un pipeline de transformaciones.' },
        { line: 98, text: 'Ejecutamos la operación decorada final, que aplica todos los decoradores en secuencia.' }
      ]
    },
    
    java: {
      code: `import java.util.function.Function;

// Interfaz Component
interface Component {
    String operation();
}

// Componente concreto
class ConcreteComponent implements Component {
    @Override
    public String operation() {
        return "ConcreteComponent";
    }
}

// Clase base para decoradores
abstract class Decorator implements Component {
    protected Component component;
    
    public Decorator(Component component) {
        this.component = component;
    }
    
    @Override
    public String operation() {
        return component.operation();
    }
}

// Decorador concreto A
class ConcreteDecoratorA extends Decorator {
    public ConcreteDecoratorA(Component component) {
        super(component);
    }
    
    @Override
    public String operation() {
        return "ConcreteDecoratorA(" + super.operation() + ")";
    }
}

// Decorador concreto B
class ConcreteDecoratorB extends Decorator {
    public ConcreteDecoratorB(Component component) {
        super(component);
    }
    
    private String addedBehavior() {
        return " con comportamiento B adicional";
    }
    
    @Override
    public String operation() {
        return "ConcreteDecoratorB(" + super.operation() + ")" + addedBehavior();
    }
}

// Uso mediante programación funcional con Java 8+
class FunctionalDecorator {
    public static Function<String, String> decoratorA = 
        s -> "ConcreteDecoratorA(" + s + ")";
    
    public static Function<String, String> decoratorB = 
        s -> "ConcreteDecoratorB(" + s + ") con comportamiento B adicional";
}

// Cliente
public class DecoratorDemo {
    // Función cliente que utiliza los componentes
    public static void clientCode(Component component) {
        System.out.println("RESULTADO: " + component.operation());
    }
    
    public static void main(String[] args) {
        // Componente simple
        Component simple = new ConcreteComponent();
        System.out.println("Cliente: Tengo un componente simple:");
        clientCode(simple);
        
        // Decoramos el componente simple con A
        Component decorator1 = new ConcreteDecoratorA(simple);
        System.out.println("Cliente: Ahora tengo un componente decorado con A:");
        clientCode(decorator1);
        
        // Decoramos aún más con B
        Component decorator2 = new ConcreteDecoratorB(decorator1);
        System.out.println("Cliente: Ahora tengo un componente decorado con B:");
        clientCode(decorator2);
        
        // Versión funcional
        System.out.println("\\nEnfoque funcional del patrón Decorator:");
        String result = "ConcreteComponent";
        
        // Aplicar decoradores usando composición de funciones
        result = FunctionalDecorator.decoratorA.apply(result);
        result = FunctionalDecorator.decoratorB.apply(result);
        
        System.out.println("RESULTADO: " + result);
        
        // Encadenar decoradores (más elegante)
        String resultChained = FunctionalDecorator.decoratorB.compose(FunctionalDecorator.decoratorA)
                              .apply("ConcreteComponent");
        
        System.out.println("RESULTADO (encadenado): " + resultChained);
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos Function de Java para la implementación funcional del patrón.' },
        { line: 3, text: 'Definimos la interfaz Component que todos los componentes concretos y decoradores implementarán.' },
        { line: 8, text: 'Implementación concreta del componente base.' },
        { line: 15, text: 'La clase Decorator abstracta implementa Component y sirve como base para todos los decoradores.' },
        { line: 18, text: 'Constructor que acepta el componente a decorar.' },
        { line: 22, text: 'La implementación por defecto simplemente delega al componente decorado.' },
        { line: 28, text: 'ConcreteDecoratorA es un decorador específico que extiende la funcionalidad.' },
        { line: 34, text: 'Sobrescribe operation para añadir su comportamiento adicional.' },
        { line: 39, text: 'ConcreteDecoratorB es otro decorador con su propia funcionalidad.' },
        { line: 44, text: 'Este decorador incluye un método privado que proporciona comportamiento adicional.' },
        { line: 54, text: 'Implementamos una versión funcional del patrón usando las características de Java 8+.' },
        { line: 55, text: 'Definimos decoradores como funciones que transforman cadenas.' },
        { line: 65, text: 'La función cliente muestra el resultado de la operación del componente.' },
        { line: 83, text: 'Demostramos el enfoque funcional del patrón Decorator.' },
        { line: 87, text: 'Aplicamos los decoradores secuencialmente usando el método apply.' },
        { line: 92, text: 'Una forma más elegante es usar compose para encadenar funciones, aplicándolas de derecha a izquierda.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Gestión de memoria',
      cppTraditional: 'Requiere gestión manual de memoria con new/delete, lo que puede llevar a fugas de memoria si no se maneja correctamente.',
      cppModern: 'Usa punteros inteligentes (shared_ptr) para la gestión automática de memoria, evitando fugas.',
      java: 'La memoria es gestionada automáticamente por el recolector de basura de Java.'
    },
    {
      title: 'Flexibilidad',
      cppTraditional: 'Implementación basada en clases con herencia, menos flexible para cambios dinámicos.',
      cppModern: 'Ofrece tanto la implementación basada en clases como una versión funcional usando lambdas y functores.',
      java: 'Proporciona implementación basada en clases y, con Java 8+, también permite enfoques funcionales.'
    },
    {
      title: 'Seguridad tipográfica',
      cppTraditional: 'Fuerte tipado en tiempo de compilación, pero más propenso a errores de puntero nulo.',
      cppModern: 'Mantiene fuerte tipado y añade seguridad con punteros inteligentes que previenen errores comunes.',
      java: 'Fuerte tipado con comprobaciones en tiempo de ejecución para evitar NullPointerException.'
    },
    {
      title: 'Rendimiento',
      cppTraditional: 'Mayor rendimiento potencial, pero con mayores riesgos debido a la gestión manual de memoria.',
      cppModern: 'Ligera sobrecarga por punteros inteligentes, pero con mayor seguridad y prevención de fugas de memoria.',
      java: 'Sobrecarga del recolector de basura, pero optimizado en implementaciones modernas de JVM.'
    },
    {
      title: 'Enfoque funcional',
      cppTraditional: 'No disponible, se basa únicamente en programación orientada a objetos.',
      cppModern: 'Implementación funcional usando std::function y lambdas, permitiendo composición de decoradores.',
      java: 'Con Java 8+, se puede implementar usando la interfaz Function y métodos como apply y compose.'
    }
  ],
  
  theory: {
    background: 'El patrón Decorator fue formalizado por la Banda de los Cuatro (GoF) y se inspira en el concepto de "envolver" un regalo, donde cada envoltura añade una característica nueva manteniendo la esencia del objeto original. Este patrón promueve el principio de responsabilidad única y el principio abierto/cerrado, permitiendo añadir comportamientos a objetos individuales sin afectar a otros objetos de la misma clase.',
    
    problem: 'Extender la funcionalidad de una clase mediante herencia no siempre es flexible o práctico. La herencia es estática y afecta a todas las instancias de una clase, lo que puede llevar a una explosión de subclases cuando se necesitan múltiples combinaciones de comportamientos. Además, la herencia puede violar el principio de responsabilidad única cuando se intentan combinar múltiples funcionalidades en una sola clase.',
    
    solution: 'El patrón Decorator proporciona una alternativa flexible a la herencia para extender la funcionalidad. En lugar de utilizar la herencia para añadir responsabilidades, el patrón envuelve un objeto dentro de otro objeto (decorador) que añade la funcionalidad adicional. Múltiples decoradores pueden anidarse, cada uno añadiendo diferentes funcionalidades de forma transparente para los clientes.',
    
    applicability: [
      'Cuando necesitas añadir responsabilidades a objetos individuales dinámica y transparentemente, sin afectar a otros objetos',
      'Para responsabilidades que pueden retirarse o agregarse independientemente',
      'Cuando la extensión mediante subclases no es práctica debido a una explosión combinatoria de clases',
      'Cuando quieres añadir funcionalidades a un objeto sin modificar su código (principio Open/Closed)',
      'Cuando necesitas combinar múltiples comportamientos en diferentes configuraciones'
    ],
    
    consequences: [
      'Mayor flexibilidad que la herencia estática, permitiendo añadir o eliminar responsabilidades en tiempo de ejecución',
      'Evita clases sobrecargadas de características en lo alto de la jerarquía de herencia',
      'Permite combinar varios comportamientos envolviendo un objeto con múltiples decoradores',
      'Respeta el principio de responsabilidad única al separar la funcionalidad en clases distintas',
      'Puede resultar en un diseño con muchos objetos pequeños similares que dificulten el depurado',
      'La configuración del decorador puede ser tediosa para el cliente si requiere múltiples capas',
      'Puede complicar el proceso de identificación del tipo específico de un objeto'
    ],
    
    notes: `
      <h3>¿Cuándo DEBES usar el patrón Decorator?</h3>
      <ul>
        <li><strong>Composición dinámica:</strong> Cuando necesitas añadir o quitar comportamientos a objetos en tiempo de ejecución.</li>
        <li><strong>Modificaciones no invasivas:</strong> Para añadir funcionalidad a objetos sin modificar su código, especialmente en código de terceros o bibliotecas que no puedes modificar.</li>
        <li><strong>Comportamientos modulares:</strong> Cuando quieres implementar funcionalidades que pueden combinarse de múltiples formas sin crear una jerarquía de clases compleja.</li>
        <li><strong>Extender objetos sellados:</strong> Para añadir funcionalidades a clases marcadas como final o sealed que no permiten herencia.</li>
        <li><strong>Funcionalidades transversales:</strong> Para implementar aspectos como logging, transacciones, caché o autorización que afectan a múltiples clases de forma similar.</li>
      </ul>
      
      <h3>Variantes del patrón Decorator:</h3>
      <ul>
        <li><strong>Decorator tradicional:</strong> La implementación clásica donde cada decorador envuelve al componente y delega operaciones.</li>
        <li><strong>Decoradores con Mixins:</strong> Utiliza las capacidades de mezcla de características de lenguajes dinámicos para añadir comportamientos.</li>
        <li><strong>Decoradores con anotaciones/metadatos:</strong> Como en Java o TypeScript, donde los decoradores modifican el comportamiento de clases o métodos mediante metadatos.</li>
        <li><strong>Decoradores funcionales:</strong> En programación funcional, donde las funciones se componen para añadir comportamientos adicionales.</li>
        <li><strong>Decorator dinámico con Proxy:</strong> Implementación que utiliza el patrón Proxy o metaprogramación para añadir comportamiento dinámicamente.</li>
      </ul>
      
      <h3>Ejemplos prácticos en aplicaciones reales:</h3>
      <ul>
        <li><strong>Streams de I/O:</strong> Como en Java, donde clases como BufferedInputStream decoran FileInputStream para añadir buffering.</li>
        <li><strong>Frameworks web:</strong> Middleware en Express.js o decoradores en NestJS que añaden comportamientos como autenticación o compresión a los endpoints.</li>
        <li><strong>Interfaces gráficas:</strong> Decoradores que añaden bordes, scrollbars o comportamientos a componentes visuales.</li>
        <li><strong>Procesamiento de texto:</strong> Añadir formato (negrita, cursiva, subrayado) a texto sin modificar el contenido original.</li>
        <li><strong>Caché y memoización:</strong> Decoradores que añaden caché a funciones costosas sin modificar la implementación original.</li>
        <li><strong>Sistemas de logging:</strong> Decoradores que añaden registro de llamadas a métodos de forma transparente.</li>
      </ul>
      
      <h3>Decorator vs Adapter vs Proxy</h3>
      <ul>
        <li><strong>Decorator:</strong> Añade responsabilidades adicionales a un objeto sin cambiar su interfaz, permitiendo comportamientos apilables.</li>
        <li><strong>Adapter:</strong> Cambia la interfaz de un objeto existente para hacerla compatible con lo que espera el cliente, facilitando la comunicación entre componentes incompatibles.</li>
        <li><strong>Proxy:</strong> Proporciona un sustituto para controlar el acceso a otro objeto, mientras que Decorator añade responsabilidades sin controlar el acceso.</li>
      </ul>
    `
  },
  
  notes: 'El patrón Decorator es ampliamente utilizado en muchas bibliotecas y frameworks, como los streams de I/O en Java (java.io) y los streams de C++ (iostream). En C++ moderno, se puede implementar de manera más segura y eficiente usando punteros inteligentes y programación funcional. En Java, con características introducidas en Java 8 como lambdas y la API Stream, este patrón puede implementarse de forma más concisa y funcional.'
};

export default decoratorPattern;
