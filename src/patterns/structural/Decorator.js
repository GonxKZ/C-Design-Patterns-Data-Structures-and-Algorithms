const decoratorPattern = {
  id: 'decorator',
  name: 'Decorator',
  category: 'structural',
  description: 'El patrón Decorator permite añadir responsabilidades adicionales a objetos de forma dinámica, proporcionando una alternativa flexible a la herencia para extender la funcionalidad.',
  
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
    background: 'El patrón Decorator fue introducido por primera vez por el Gang of Four en su libro "Design Patterns: Elements of Reusable Object-Oriented Software". Está inspirado en el concepto de composición sobre herencia, que es un principio fundamental en el diseño orientado a objetos.',
    problem: 'A veces necesitamos añadir responsabilidades a objetos individuales dinámicamente y de forma transparente, sin afectar a otros objetos. La herencia no es viable porque es estática y se aplica a toda una clase, no a instancias individuales.',
    solution: 'El patrón Decorator adjunta responsabilidades adicionales a un objeto dinámicamente. Los decoradores proporcionan una alternativa flexible a la herencia para extender la funcionalidad, permitiendo añadir comportamientos antes o después de la operación del componente base.',
    applicability: [
      'Cuando necesitas añadir responsabilidades a objetos individuales dinámicamente y de forma transparente, sin afectar a otros objetos.',
      'Cuando la extensión mediante herencia no es práctica o posible, como con clases finales (sealed/final classes).',
      'Cuando quieres añadir y eliminar responsabilidades en tiempo de ejecución.',
      'Cuando la extensión mediante subclases resultaría en una explosión de clases para cubrir todas las combinaciones posibles.'
    ],
    consequences: [
      'Mayor flexibilidad que la herencia estática, permitiendo añadir o eliminar responsabilidades en tiempo de ejecución.',
      'Evita clases recargadas de características en los niveles altos de la jerarquía.',
      'Permite combinar múltiples comportamientos envolviendo un objeto con varios decoradores.',
      'Un decorador y su componente no son idénticos, por lo que no se debe confiar en la identidad del objeto cuando se usan decoradores.',
      'Puede resultar en sistemas con muchos objetos pequeños similares que son difíciles de aprender y depurar.'
    ]
  },
  
  notes: 'El patrón Decorator es ampliamente utilizado en muchas bibliotecas y frameworks, como los streams de I/O en Java (java.io) y los streams de C++ (iostream). En C++ moderno, se puede implementar de manera más segura y eficiente usando punteros inteligentes y programación funcional. En Java, con características introducidas en Java 8 como lambdas y la API Stream, este patrón puede implementarse de forma más concisa y funcional.'
};

export default decoratorPattern;
