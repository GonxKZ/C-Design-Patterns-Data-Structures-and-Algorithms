const visitorPattern = {
  id: 'visitor',
  name: 'Visitor',
  category: 'behavioral',
  description: 'El patrón Visitor permite definir nuevas operaciones sobre una estructura de objetos sin cambiar las clases de los objetos sobre los que opera.',
  
  theory: {
    background: 'Cuando trabajamos con estructuras de objetos complejas, como árboles o grafos, a menudo necesitamos realizar diferentes operaciones sobre estos objetos.',
    problem: 'Si añadimos constantemente nuevas operaciones a las clases existentes, estas se vuelven difíciles de mantener y violan el principio de responsabilidad única.',
    solution: 'El patrón Visitor separa los algoritmos de la estructura de objetos sobre la que operan, permitiendo añadir nuevas operaciones sin modificar las clases existentes.',
    applicability: [
      'Cuando necesitas realizar operaciones sobre una estructura de objetos compleja y las operaciones difieren en tipo',
      'Cuando la estructura de objetos contiene muchas clases con interfaces diferentes y quieres realizar operaciones que dependen de sus clases concretas',
      'Cuando las clases que definen la estructura del objeto rara vez cambian, pero con frecuencia necesitas definir nuevas operaciones sobre ella',
      'Cuando quieres evitar contaminar las clases con operaciones que no les corresponden directamente'
    ],
    consequences: [
      'Facilita añadir nuevas operaciones sin modificar las clases existentes (principio Open/Closed)',
      'Consolida operaciones relacionadas en una clase Visitor',
      'Puede visitar objetos que no comparten una interfaz común',
      'Dificulta añadir nuevas clases a la estructura de objetos, pues requiere actualizar todos los visitantes',
      'Puede romper la encapsulación al requerir que los elementos expongan su estado interno a los visitantes'
    ]
  },
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <vector>
#include <string>

// Declaraciones adelantadas
class ConcreteComponentA;
class ConcreteComponentB;

// Interfaz Visitor
class Visitor {
public:
    virtual ~Visitor() {}
    virtual void VisitConcreteComponentA(const ConcreteComponentA* element) const = 0;
    virtual void VisitConcreteComponentB(const ConcreteComponentB* element) const = 0;
};

// Interfaz Component
class Component {
public:
    virtual ~Component() {}
    virtual void Accept(const Visitor* visitor) const = 0;
};

// Componente Concreto A
class ConcreteComponentA : public Component {
public:
    void Accept(const Visitor* visitor) const override {
        visitor->VisitConcreteComponentA(this);
    }
    
    std::string ExclusiveMethodOfConcreteComponentA() const {
        return "A";
    }
};

// Componente Concreto B
class ConcreteComponentB : public Component {
public:
    void Accept(const Visitor* visitor) const override {
        visitor->VisitConcreteComponentB(this);
    }
    
    std::string SpecialMethodOfConcreteComponentB() const {
        return "B";
    }
};

// Visitante Concreto 1
class ConcreteVisitor1 : public Visitor {
public:
    void VisitConcreteComponentA(const ConcreteComponentA* element) const override {
        std::cout << "ConcreteVisitor1: " << element->ExclusiveMethodOfConcreteComponentA() 
                  << " + ConcreteVisitor1" << std::endl;
    }
    
    void VisitConcreteComponentB(const ConcreteComponentB* element) const override {
        std::cout << "ConcreteVisitor1: " << element->SpecialMethodOfConcreteComponentB() 
                  << " + ConcreteVisitor1" << std::endl;
    }
};

// Visitante Concreto 2
class ConcreteVisitor2 : public Visitor {
public:
    void VisitConcreteComponentA(const ConcreteComponentA* element) const override {
        std::cout << "ConcreteVisitor2: " << element->ExclusiveMethodOfConcreteComponentA() 
                  << " + ConcreteVisitor2" << std::endl;
    }
    
    void VisitConcreteComponentB(const ConcreteComponentB* element) const override {
        std::cout << "ConcreteVisitor2: " << element->SpecialMethodOfConcreteComponentB() 
                  << " + ConcreteVisitor2" << std::endl;
    }
};

// Código Cliente
void ClientCode(const std::vector<const Component*>& components, const Visitor* visitor) {
    for (const Component* comp : components) {
        comp->Accept(visitor);
    }
}

// Función principal
int main() {
    std::vector<const Component*> components;
    components.push_back(new ConcreteComponentA());
    components.push_back(new ConcreteComponentB());
    
    std::cout << "Cliente: Con ConcreteVisitor1:" << std::endl;
    ConcreteVisitor1* visitor1 = new ConcreteVisitor1();
    ClientCode(components, visitor1);
    
    std::cout << "\nCliente: Con ConcreteVisitor2:" << std::endl;
    ConcreteVisitor2* visitor2 = new ConcreteVisitor2();
    ClientCode(components, visitor2);
    
    // Limpieza de memoria
    for (const Component* comp : components) {
        delete comp;
    }
    delete visitor1;
    delete visitor2;
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas estándar necesarias.' },
        { line: 5, text: 'Declaraciones adelantadas para las clases concretas que serán visitadas.' },
        { line: 8, text: 'Definimos la interfaz Visitor que declara un método de visita para cada tipo de componente.' },
        { line: 10, text: 'El destructor virtual es necesario para la correcta liberación de memoria en clases polimórficas.' },
        { line: 11, text: 'Método virtual puro para visitar componentes de tipo A.' },
        { line: 12, text: 'Método virtual puro para visitar componentes de tipo B.' },
        { line: 16, text: 'Interfaz Component que todos los elementos visitables deben implementar.' },
        { line: 18, text: 'Destructor virtual para una correcta liberación de memoria.' },
        { line: 19, text: 'Método Accept virtual puro que recibe un visitante.' },
        { line: 23, text: 'Componente concreto A que implementa la interfaz Component.' },
        { line: 25, text: 'Implementación del método Accept que llama al método apropiado del visitante.' },
        { line: 29, text: 'Método específico de este componente que proporciona datos únicos.' },
        { line: 34, text: 'Componente concreto B con comportamiento diferente.' },
        { line: 36, text: 'Implementación de Accept, que llama al método específico para componentes B en el visitante.' },
        { line: 40, text: 'Método específico de componentes B, con nombre diferente para ilustrar la diversidad.' },
        { line: 45, text: 'Primera implementación concreta del Visitor.' },
        { line: 47, text: 'Implementación del método para visitar componentes A.' },
        { line: 48, text: 'Accede a los métodos específicos del componente A.' },
        { line: 52, text: 'Implementación del método para visitar componentes B.' },
        { line: 53, text: 'Accede a los métodos específicos del componente B.' },
        { line: 58, text: 'Segunda implementación concreta del Visitor, con comportamiento diferente.' },
        { line: 60, text: 'Implementación alternativa para visitar componentes A.' },
        { line: 65, text: 'Implementación alternativa para visitar componentes B.' },
        { line: 71, text: 'Código cliente que utiliza el patrón Visitor.' },
        { line: 72, text: 'Itera sobre una colección de componentes.' },
        { line: 73, text: 'Cada componente acepta al visitante, lo que desencadena la llamada al método adecuado.' },
        { line: 79, text: 'En la función principal, creamos diversos componentes.' },
        { line: 84, text: 'Creamos el primer visitante y lo aplicamos a los componentes.' },
        { line: 88, text: 'Creamos el segundo visitante y lo aplicamos a los mismos componentes, obteniendo comportamientos diferentes.' },
        { line: 92, text: 'Limpiamos la memoria asignada dinámicamente.' }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <vector>
#include <string>
#include <memory>
#include <variant>
#include <functional>

// Declaraciones adelantadas
class ConcreteComponentA;
class ConcreteComponentB;

// Interfaz Visitor usando punteros inteligentes
class Visitor {
public:
    virtual ~Visitor() = default;
    virtual void VisitConcreteComponentA(const std::shared_ptr<ConcreteComponentA>& element) const = 0;
    virtual void VisitConcreteComponentB(const std::shared_ptr<ConcreteComponentB>& element) const = 0;
};

// Interfaz Component
class Component {
public:
    virtual ~Component() = default;
    virtual void Accept(const std::shared_ptr<Visitor>& visitor) const = 0;
};

// Componente Concreto A
class ConcreteComponentA : public Component, public std::enable_shared_from_this<ConcreteComponentA> {
public:
    void Accept(const std::shared_ptr<Visitor>& visitor) const override {
        visitor->VisitConcreteComponentA(std::const_pointer_cast<ConcreteComponentA>(
            shared_from_this()));
    }
    
    std::string ExclusiveMethodOfConcreteComponentA() const {
        return "A";
    }
};

// Componente Concreto B
class ConcreteComponentB : public Component, public std::enable_shared_from_this<ConcreteComponentB> {
public:
    void Accept(const std::shared_ptr<Visitor>& visitor) const override {
        visitor->VisitConcreteComponentB(std::const_pointer_cast<ConcreteComponentB>(
            shared_from_this()));
    }
    
    std::string SpecialMethodOfConcreteComponentB() const {
        return "B";
    }
};

// Visitante Concreto 1
class ConcreteVisitor1 : public Visitor {
public:
    void VisitConcreteComponentA(const std::shared_ptr<ConcreteComponentA>& element) const override {
        std::cout << "ConcreteVisitor1: " << element->ExclusiveMethodOfConcreteComponentA() 
                  << " + ConcreteVisitor1" << std::endl;
    }
    
    void VisitConcreteComponentB(const std::shared_ptr<ConcreteComponentB>& element) const override {
        std::cout << "ConcreteVisitor1: " << element->SpecialMethodOfConcreteComponentB() 
                  << " + ConcreteVisitor1" << std::endl;
    }
};

// Visitante Concreto 2
class ConcreteVisitor2 : public Visitor {
public:
    void VisitConcreteComponentA(const std::shared_ptr<ConcreteComponentA>& element) const override {
        std::cout << "ConcreteVisitor2: " << element->ExclusiveMethodOfConcreteComponentA() 
                  << " + ConcreteVisitor2" << std::endl;
    }
    
    void VisitConcreteComponentB(const std::shared_ptr<ConcreteComponentB>& element) const override {
        std::cout << "ConcreteVisitor2: " << element->SpecialMethodOfConcreteComponentB() 
                  << " + ConcreteVisitor2" << std::endl;
    }
};

// Implementación alternativa usando std::variant (C++17)
class ModernComponent;
using VariantComponent = std::variant<
    std::monostate,
    std::reference_wrapper<ConcreteComponentA>,
    std::reference_wrapper<ConcreteComponentB>
>;

class ModernVisitor {
public:
    void operator()(std::monostate) const {}
    
    void operator()(std::reference_wrapper<ConcreteComponentA> element) const {
        std::cout << "ModernVisitor: " << element.get().ExclusiveMethodOfConcreteComponentA() 
                  << " + ModernVisitor" << std::endl;
    }
    
    void operator()(std::reference_wrapper<ConcreteComponentB> element) const {
        std::cout << "ModernVisitor: " << element.get().SpecialMethodOfConcreteComponentB() 
                  << " + ModernVisitor" << std::endl;
    }
};

// Código Cliente
void ClientCode(const std::vector<std::shared_ptr<Component>>& components, 
                const std::shared_ptr<Visitor>& visitor) {
    for (const auto& comp : components) {
        comp->Accept(visitor);
    }
}

// Función principal
int main() {
    // Usando implementación con shared_ptr
    std::vector<std::shared_ptr<Component>> components;
    components.push_back(std::make_shared<ConcreteComponentA>());
    components.push_back(std::make_shared<ConcreteComponentB>());
    
    std::cout << "Cliente: Con ConcreteVisitor1:" << std::endl;
    auto visitor1 = std::make_shared<ConcreteVisitor1>();
    ClientCode(components, visitor1);
    
    std::cout << "\nCliente: Con ConcreteVisitor2:" << std::endl;
    auto visitor2 = std::make_shared<ConcreteVisitor2>();
    ClientCode(components, visitor2);
    
    // Usando implementación con std::variant (C++17)
    std::cout << "\nCliente: Usando variant visitor (C++17):" << std::endl;
    ConcreteComponentA compA;
    ConcreteComponentB compB;
    
    std::vector<VariantComponent> variantComponents = {
        std::ref(compA),
        std::ref(compB)
    };
    
    ModernVisitor modernVisitor;
    for (const auto& comp : variantComponents) {
        std::visit(modernVisitor, comp);
    }
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas estándar y las específicas para C++ moderno.' },
        { line: 4, text: 'Incluimos <memory> para usar punteros inteligentes.' },
        { line: 5, text: 'Incluimos <variant> para la implementación alternativa con C++17.' },
        { line: 6, text: 'Incluimos <functional> para std::reference_wrapper.' },
        { line: 12, text: 'Definimos la interfaz Visitor usando smart pointers en lugar de punteros crudos.' },
        { line: 14, text: 'Usamos =default para el destructor virtual, característica de C++11.' },
        { line: 15, text: 'Métodos de visita que ahora reciben std::shared_ptr en lugar de punteros crudos.' },
        { line: 21, text: 'Interfaz Component adaptada para usar punteros inteligentes.' },
        { line: 27, text: 'ConcreteComponentA hereda de Component y de std::enable_shared_from_this para obtener un shared_ptr a sí mismo.' },
        { line: 29, text: 'Implementación de Accept usando punteros inteligentes.' },
        { line: 30, text: 'Usamos shared_from_this() para obtener un puntero compartido al objeto actual.' },
        { line: 39, text: 'ConcreteComponentB también usa std::enable_shared_from_this.' },
        { line: 56, text: 'Las implementaciones de Visitor ahora trabajan con punteros compartidos.' },
        { line: 74, text: 'Implementación alternativa usando std::variant (C++17).' },
        { line: 75, text: 'Declaración adelantada para ModernComponent.' },
        { line: 76, text: 'Definimos un tipo variante que puede contener cualquiera de nuestros componentes.' },
        { line: 82, text: 'ModernVisitor utiliza sobrecarga de operadores en lugar de polimorfismo virtual.' },
        { line: 83, text: 'Implementamos operator() sobrecargado para cada tipo de componente.' },
        { line: 85, text: 'Manejador para std::monostate (caso vacío).' },
        { line: 87, text: 'Manejador para ComponentA que usa reference_wrapper.' },
        { line: 92, text: 'Manejador para ComponentB.' },
        { line: 99, text: 'Código cliente adaptado para usar punteros inteligentes.' },
        { line: 106, text: 'En la función principal, creamos nuestros componentes usando std::make_shared.' },
        { line: 107, text: 'Vector de punteros compartidos a Component.' },
        { line: 115, text: 'Creamos visitantes con std::make_shared.' },
        { line: 121, text: 'Demostración de la implementación alternativa con std::variant.' },
        { line: 122, text: 'Creamos instancias de componentes en la pila (no en el heap).' },
        { line: 125, text: 'Vector de VariantComponent.' },
        { line: 131, text: 'Usamos std::visit para aplicar el visitante a cada variante.' }
      ]
    },
    java: {
      code: `import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

// Interfaces para Visitor y Element
interface Visitor {
    void visitElementA(ElementA element);
    void visitElementB(ElementB element);
}

interface Element {
    void accept(Visitor visitor);
}

// Elementos concretos
class ElementA implements Element {
    @Override
    public void accept(Visitor visitor) {
        visitor.visitElementA(this);
    }
    
    public String operationA() {
        return "A";
    }
}

class ElementB implements Element {
    @Override
    public void accept(Visitor visitor) {
        visitor.visitElementB(this);
    }
    
    public String operationB() {
        return "B";
    }
}

// Visitantes concretos
class ConcreteVisitor1 implements Visitor {
    @Override
    public void visitElementA(ElementA element) {
        System.out.println("ConcreteVisitor1: " + element.operationA() + " + ConcreteVisitor1");
    }
    
    @Override
    public void visitElementB(ElementB element) {
        System.out.println("ConcreteVisitor1: " + element.operationB() + " + ConcreteVisitor1");
    }
}

class ConcreteVisitor2 implements Visitor {
    @Override
    public void visitElementA(ElementA element) {
        System.out.println("ConcreteVisitor2: " + element.operationA() + " + ConcreteVisitor2");
    }
    
    @Override
    public void visitElementB(ElementB element) {
        System.out.println("ConcreteVisitor2: " + element.operationB() + " + ConcreteVisitor2");
    }
}

// Implementación con Java 8+ usando lambdas
class ModernElementA {
    public String operationA() {
        return "A";
    }
    
    public void accept(Consumer<ModernElementA> visitor) {
        visitor.accept(this);
    }
}

class ModernElementB {
    public String operationB() {
        return "B";
    }
    
    public void accept(Consumer<ModernElementB> visitor) {
        visitor.accept(this);
    }
}

// Clase principal
public class VisitorDemo {
    // Método para mostrar la implementación tradicional
    public static void demoTraditional() {
        List<Element> elements = new ArrayList<>();
        elements.add(new ElementA());
        elements.add(new ElementB());
        
        System.out.println("Cliente: Con ConcreteVisitor1:");
        Visitor visitor1 = new ConcreteVisitor1();
        elements.forEach(element -> element.accept(visitor1));
        
        System.out.println("\nCliente: Con ConcreteVisitor2:");
        Visitor visitor2 = new ConcreteVisitor2();
        elements.forEach(element -> element.accept(visitor2));
    }
    
    // Método para mostrar la implementación con Java 8+
    public static void demoModern() {
        System.out.println("\nCliente: Usando Consumer (Java 8+):");
        
        ModernElementA elementA = new ModernElementA();
        ModernElementB elementB = new ModernElementB();
        
        // Definir visitantes como lambdas
        Consumer<ModernElementA> visitorA = e -> 
            System.out.println("Lambda visitor: " + e.operationA() + " + Lambda");
        
        Consumer<ModernElementB> visitorB = e -> 
            System.out.println("Lambda visitor: " + e.operationB() + " + Lambda");
        
        // Visitar elementos
        elementA.accept(visitorA);
        elementB.accept(visitorB);
    }
    
    public static void main(String[] args) {
        // Demostrar ambas implementaciones
        demoTraditional();
        demoModern();
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos las clases necesarias para listas y lambdas.' },
        { line: 5, text: 'Definimos la interfaz Visitor con métodos para cada tipo de elemento.' },
        { line: 10, text: 'Definimos la interfaz Element que todos los elementos visitables deben implementar.' },
        { line: 14, text: 'Implementación concreta del elemento A.' },
        { line: 16, text: 'Implementación del método accept que redirecciona al método específico del visitante.' },
        { line: 20, text: 'Método específico de ElementA que proporciona datos únicos.' },
        { line: 24, text: 'Implementación concreta del elemento B.' },
        { line: 26, text: 'Implementación del método accept específico para elementos B.' },
        { line: 34, text: 'Implementación concreta del primer visitante.' },
        { line: 36, text: 'Método para visitar elementos de tipo A.' },
        { line: 41, text: 'Método para visitar elementos de tipo B.' },
        { line: 45, text: 'Implementación concreta del segundo visitante con comportamiento diferente.' },
        { line: 56, text: 'Implementación alternativa usando Java 8+ con lambdas.' },
        { line: 57, text: 'Elemento moderno A sin interfaces tradicionales.' },
        { line: 61, text: 'Método accept que recibe un Consumer<ModernElementA> en lugar de un visitante tradicional.' },
        { line: 66, text: 'Elemento moderno B con enfoque similar.' },
        { line: 76, text: 'Clase principal con método main.' },
        { line: 78, text: 'Método para demostrar la implementación tradicional.' },
        { line: 80, text: 'Creamos una lista de elementos.' },
        { line: 84, text: 'Creamos el primer visitante y lo aplicamos a todos los elementos.' },
        { line: 85, text: 'Usamos forEach con lambda, característica de Java 8+.' },
        { line: 92, text: 'Método para demostrar la implementación moderna con Consumer.' },
        { line: 96, text: 'Creamos instancias de los elementos modernos.' },
        { line: 99, text: 'Definimos visitantes como lambdas usando Consumer.' },
        { line: 105, text: 'Aplicamos los visitantes a los elementos correspondientes.' },
        { line: 111, text: 'Método main que ejecuta ambas demostraciones.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Flexibilidad',
      cppTraditional: 'Estructura rígida con doble dispatch, buen soporte para añadir nuevas operaciones, difícil añadir nuevos elementos.',
      cppModern: 'Mayor flexibilidad con variante, permite añadir nuevas operaciones fácilmente y simplifica la gestión de memoria.',
      java: 'Similar al C++ tradicional, pero con sintaxis más limpia y gestión automática de memoria. La versión con lambdas ofrece más flexibilidad.'
    },
    {
      title: 'Seguridad de tipos',
      cppTraditional: 'Verificación de tipos en tiempo de compilación para las operaciones del visitante.',
      cppModern: 'Alta seguridad de tipos tanto con shared_ptr como con std::variant, que previene errores de tipo en tiempo de compilación.',
      java: 'Buena seguridad de tipos en ambas implementaciones, con verificación en tiempo de compilación.'
    },
    {
      title: 'Mantenimiento',
      cppTraditional: 'Requiere modificar todos los visitantes al añadir nuevos elementos, propenso a errores de memoria.',
      cppModern: 'Mejor mantenimiento con gestión automática de memoria, pero aún requiere modificar visitantes para nuevos elementos.',
      java: 'Mantenimiento simplificado sin gestión manual de memoria, con la misma limitación de actualizar todos los visitantes.'
    },
    {
      title: 'Rendimiento',
      cppTraditional: 'Mayor rendimiento al usar punteros crudos, pero con riesgo de fugas de memoria.',
      cppModern: 'Ligero overhead por shared_ptr y std::variant, compensado por seguridad y facilidad de uso.',
      java: 'Overhead del recolector de basura, pero código más seguro y simple. La versión con lambdas puede tener mejor rendimiento.'
    }
  ],
  
  notes: 'El patrón Visitor es particularmente útil en procesadores de lenguaje (compiladores, intérpretes), donde diferentes operaciones (análisis sintáctico, optimización, generación de código) deben aplicarse a diferentes nodos de un árbol sintáctico. También se usa extensamente en frameworks de serialización, donde diversos formatos de salida pueden aplicarse a una estructura de datos sin modificar las clases originales. Aunque es muy potente, debe usarse con cuidado, ya que añadir nuevas clases a la estructura visitada requiere modificar todos los visitantes existentes.'
};

export default visitorPattern; 