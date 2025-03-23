const compositePattern = {
  id: 'composite',
  name: 'Composite',
  category: 'structural',
  description: 'El patrón Composite permite tratar objetos individuales y composiciones de objetos de manera uniforme, creando estructuras de árbol jerárquicas donde los clientes pueden tratar tanto objetos individuales como compuestos de la misma manera.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <memory>

// Interfaz Component
class Component {
protected:
    std::string name;
    
public:
    Component(const std::string& name) : name(name) {}
    virtual ~Component() {}
    
    virtual void add(Component* component) {
        throw std::logic_error("No se puede añadir a un componente hoja");
    }
    
    virtual void remove(Component* component) {
        throw std::logic_error("No se puede eliminar de un componente hoja");
    }
    
    virtual bool isComposite() const {
        return false;
    }
    
    virtual void operation() const = 0;
    
    std::string getName() const {
        return name;
    }
};

// Leaf (Componente hoja)
class Leaf : public Component {
public:
    Leaf(const std::string& name) : Component(name) {}
    
    void operation() const override {
        std::cout << "Operación en hoja " << name << std::endl;
    }
};

// Composite (Componente compuesto)
class Composite : public Component {
private:
    std::vector<Component*> children;
    
public:
    Composite(const std::string& name) : Component(name) {}
    
    ~Composite() {
        // En una implementación real, aquí podríamos liberar la memoria
        // de los hijos si somos responsables de ellos
    }
    
    void add(Component* component) override {
        children.push_back(component);
    }
    
    void remove(Component* component) override {
        children.erase(
            std::remove(children.begin(), children.end(), component),
            children.end()
        );
    }
    
    bool isComposite() const override {
        return true;
    }
    
    void operation() const override {
        std::cout << "Operación en compuesto " << name << " [" << std::endl;
        
        for (const auto& child : children) {
            child->operation();
        }
        
        std::cout << "] Fin de " << name << std::endl;
    }
};

// Función cliente que utiliza componentes
void clientCode(const Component& component) {
    component.operation();
}

// Uso del patrón composite
int main() {
    // Crear componentes individuales
    Leaf* leaf1 = new Leaf("Hoja 1");
    Leaf* leaf2 = new Leaf("Hoja 2");
    Leaf* leaf3 = new Leaf("Hoja 3");
    
    // Crear composites
    Composite* composite1 = new Composite("Compuesto 1");
    Composite* composite2 = new Composite("Compuesto 2");
    
    // Construir la estructura
    composite1->add(leaf1);
    composite1->add(composite2);
    composite2->add(leaf2);
    composite2->add(leaf3);
    
    // Usar componentes individualmente
    std::cout << "Cliente: Operación en una hoja:" << std::endl;
    clientCode(*leaf1);
    std::cout << std::endl;
    
    // Usar la estructura compuesta
    std::cout << "Cliente: Operación en un compuesto complejo:" << std::endl;
    clientCode(*composite1);
    
    // Limpieza de memoria
    delete leaf1;
    delete leaf2;
    delete leaf3;
    delete composite1;
    delete composite2;
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas necesarias para este patrón.' },
        { line: 7, text: 'Definimos la interfaz Component que será implementada tanto por hojas como por compuestos.' },
        { line: 12, text: 'Constructor que toma un nombre para identificar cada componente.' },
        { line: 13, text: 'Destructor virtual para permitir la correcta destrucción de clases derivadas.' },
        { line: 15, text: 'Método add por defecto lanza una excepción ya que no tiene sentido para componentes hoja.' },
        { line: 19, text: 'Método remove por defecto también lanza una excepción por la misma razón.' },
        { line: 23, text: 'Método isComposite permite verificar si un componente es compuesto o no.' },
        { line: 27, text: 'Método operation abstracto que debe ser implementado por las clases concretas.' },
        { line: 35, text: 'Leaf es un componente hoja que representa objetos individuales que no tienen hijos.' },
        { line: 38, text: 'Implementación de operation para hojas, simplemente imprime información del componente.' },
        { line: 44, text: 'Composite es un componente que puede contener otros componentes (hojas o compuestos).' },
        { line: 46, text: 'Mantiene una colección de componentes hijos.' },
        { line: 53, text: 'En un sistema real, aquí se liberaría la memoria de los hijos si el composite es propietario.' },
        { line: 57, text: 'Implementa add para permitir agregar componentes hijos.' },
        { line: 61, text: 'Implementa remove para eliminar componentes hijos.' },
        { line: 67, text: 'Sobrescribe isComposite para indicar que es un componente compuesto.' },
        { line: 71, text: 'Implementa operation recorriendo recursivamente todos los hijos.' },
        { line: 83, text: 'Función cliente que trabaja con componentes a través de la interfaz común.' },
        { line: 88, text: 'En el ejemplo de uso, creamos varios componentes hoja y compuestos.' },
        { line: 97, text: 'Construimos una estructura jerárquica anidando compuestos y hojas.' },
        { line: 104, text: 'Demostramos cómo el cliente puede trabajar con un componente hoja individual.' },
        { line: 109, text: 'Demostramos cómo el mismo cliente puede trabajar con una estructura compuesta compleja.' },
        { line: 112, text: 'Liberamos manualmente la memoria al final, lo que es necesario en C++ tradicional.' }
      ]
    },
    
    cppModern: {
      code: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <memory>
#include <functional>

// Interfaz Component utilizando std::shared_ptr
class Component : public std::enable_shared_from_this<Component> {
protected:
    std::string name;
    std::weak_ptr<Component> parent;
    
public:
    explicit Component(std::string name) : name(std::move(name)) {}
    virtual ~Component() = default;
    
    void setParent(const std::shared_ptr<Component>& parent) {
        this->parent = parent;
    }
    
    std::shared_ptr<Component> getParent() const {
        return parent.lock();
    }
    
    virtual void add(const std::shared_ptr<Component>& component) {
        throw std::logic_error("No se puede añadir a un componente hoja");
    }
    
    virtual void remove(const std::shared_ptr<Component>& component) {
        throw std::logic_error("No se puede eliminar de un componente hoja");
    }
    
    virtual bool isComposite() const {
        return false;
    }
    
    virtual void operation() const = 0;
    
    std::string getName() const {
        return name;
    }
};

// Leaf (Componente hoja)
class Leaf : public Component {
public:
    explicit Leaf(std::string name) : Component(std::move(name)) {}
    
    void operation() const override {
        std::cout << "Operación en hoja " << name << std::endl;
    }
};

// Composite (Componente compuesto)
class Composite : public Component {
private:
    std::vector<std::shared_ptr<Component>> children;
    
public:
    explicit Composite(std::string name) : Component(std::move(name)) {}
    
    void add(const std::shared_ptr<Component>& component) override {
        children.push_back(component);
        component->setParent(shared_from_this());
    }
    
    void remove(const std::shared_ptr<Component>& component) override {
        children.erase(
            std::remove(children.begin(), children.end(), component),
            children.end()
        );
        component->setParent(nullptr);
    }
    
    bool isComposite() const override {
        return true;
    }
    
    void operation() const override {
        std::cout << "Operación en compuesto " << name << " [" << std::endl;
        
        for (const auto& child : children) {
            child->operation();
        }
        
        std::cout << "] Fin de " << name << std::endl;
    }
    
    // Función para visitar cada componente con un visitor (patrón complementario)
    void accept(const std::function<void(const std::shared_ptr<Component>&)>& visitor) const {
        visitor(std::const_pointer_cast<Component>(shared_from_this()));
        
        for (const auto& child : children) {
            if (child->isComposite()) {
                std::static_pointer_cast<const Composite>(child)->accept(visitor);
            } else {
                visitor(child);
            }
        }
    }
};

// Función cliente que utiliza componentes
void clientCode(const std::shared_ptr<Component>& component) {
    component->operation();
}

// Uso del patrón composite con punteros inteligentes
int main() {
    // Crear componentes individuales
    auto leaf1 = std::make_shared<Leaf>("Hoja 1");
    auto leaf2 = std::make_shared<Leaf>("Hoja 2");
    auto leaf3 = std::make_shared<Leaf>("Hoja 3");
    
    // Crear composites
    auto composite1 = std::make_shared<Composite>("Compuesto 1");
    auto composite2 = std::make_shared<Composite>("Compuesto 2");
    
    // Construir la estructura
    composite1->add(leaf1);
    composite1->add(composite2);
    composite2->add(leaf2);
    composite2->add(leaf3);
    
    // Usar componentes individualmente
    std::cout << "Cliente: Operación en una hoja:" << std::endl;
    clientCode(leaf1);
    std::cout << std::endl;
    
    // Usar la estructura compuesta
    std::cout << "Cliente: Operación en un compuesto complejo:" << std::endl;
    clientCode(composite1);
    std::cout << std::endl;
    
    // Demostración de un visitor usando lambda
    std::cout << "Visitor: Listando todos los componentes:" << std::endl;
    composite1->accept([](const std::shared_ptr<Component>& component) {
        std::cout << " - " << component->getName() << std::endl;
    });
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas necesarias, incluyendo memory para punteros inteligentes y functional para lambdas.' },
        { line: 8, text: 'La clase Component ahora hereda de enable_shared_from_this para poder usar shared_from_this().' },
        { line: 10, text: 'Añadimos un puntero weak_ptr al padre para mantener relaciones bidireccionales sin crear referencias circulares.' },
        { line: 14, text: 'Constructor con std::move para evitar copias innecesarias de strings.' },
        { line: 15, text: 'Usamos default para el destructor, siguiendo la regla de 5 de C++ moderno.' },
        { line: 17, text: 'Método para establecer el padre, permitiendo navegación bidireccional en la estructura.' },
        { line: 21, text: 'Método para obtener el padre, usando lock() para convertir weak_ptr a shared_ptr.' },
        { line: 25, text: 'Los métodos add/remove ahora trabajan con shared_ptr en lugar de punteros crudos.' },
        { line: 44, text: 'Constructor de Leaf marcado como explicit para prevenir conversiones implícitas no deseadas.' },
        { line: 54, text: 'Composite ahora almacena los hijos como shared_ptr, que gestionan la memoria automáticamente.' },
        { line: 60, text: 'Al añadir un componente, establecemos una relación bidireccional con setParent.' },
        { line: 65, text: 'Al eliminar un componente, limpiamos la referencia al padre.' },
        { line: 80, text: 'La implementación de operation es similar, pero ahora trabaja con punteros inteligentes.' },
        { line: 88, text: 'Añadimos un método accept que implementa el patrón Visitor, complementando el patrón Composite.' },
        { line: 89, text: 'Usamos una función de orden superior como visitor, permitiendo procesamiento personalizado.' },
        { line: 102, text: 'La función cliente ahora recibe shared_ptr en lugar de referencias.' },
        { line: 108, text: 'Usamos make_shared para crear objetos, que es más eficiente que usar new con shared_ptr.' },
        { line: 127, text: 'Demostramos el uso del visitor con una lambda que imprime los nombres de todos los componentes.' },
        { line: 128, text: 'Esta es una implementación sencilla del patrón Visitor usando lambdas modernas en C++.' }
      ]
    },
    
    java: {
      code: `import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

// Interfaz Component
interface Component {
    void operation();
    void add(Component component);
    void remove(Component component);
    Component getParent();
    void setParent(Component parent);
    boolean isComposite();
    String getName();
}

// Componente hoja
class Leaf implements Component {
    private String name;
    private Component parent;
    
    public Leaf(String name) {
        this.name = name;
    }
    
    @Override
    public void operation() {
        System.out.println("Operación en hoja " + name);
    }
    
    @Override
    public void add(Component component) {
        throw new UnsupportedOperationException("No se puede añadir a una hoja");
    }
    
    @Override
    public void remove(Component component) {
        throw new UnsupportedOperationException("No se puede eliminar de una hoja");
    }
    
    @Override
    public boolean isComposite() {
        return false;
    }
    
    @Override
    public Component getParent() {
        return parent;
    }
    
    @Override
    public void setParent(Component parent) {
        this.parent = parent;
    }
    
    @Override
    public String getName() {
        return name;
    }
}

// Componente compuesto
class Composite implements Component {
    private String name;
    private List<Component> children = new ArrayList<>();
    private Component parent;
    
    public Composite(String name) {
        this.name = name;
    }
    
    @Override
    public void operation() {
        System.out.println("Operación en compuesto " + name + " [");
        
        for (Component child : children) {
            child.operation();
        }
        
        System.out.println("] Fin de " + name);
    }
    
    @Override
    public void add(Component component) {
        children.add(component);
        component.setParent(this);
    }
    
    @Override
    public void remove(Component component) {
        children.remove(component);
        component.setParent(null);
    }
    
    @Override
    public boolean isComposite() {
        return true;
    }
    
    @Override
    public Component getParent() {
        return parent;
    }
    
    @Override
    public void setParent(Component parent) {
        this.parent = parent;
    }
    
    @Override
    public String getName() {
        return name;
    }
    
    // Implementación de visitor utilizando Java 8 Consumer
    public void accept(Consumer<Component> visitor) {
        visitor.accept(this);
        
        for (Component child : children) {
            if (child.isComposite()) {
                ((Composite) child).accept(visitor);
            } else {
                visitor.accept(child);
            }
        }
    }
}

// Ejemplo de uso
public class CompositeDemo {
    // Función cliente que utiliza componentes
    public static void clientCode(Component component) {
        component.operation();
    }
    
    public static void main(String[] args) {
        // Crear componentes individuales
        Component leaf1 = new Leaf("Hoja 1");
        Component leaf2 = new Leaf("Hoja 2");
        Component leaf3 = new Leaf("Hoja 3");
        
        // Crear composites
        Composite composite1 = new Composite("Compuesto 1");
        Composite composite2 = new Composite("Compuesto 2");
        
        // Construir la estructura
        composite1.add(leaf1);
        composite1.add(composite2);
        composite2.add(leaf2);
        composite2.add(leaf3);
        
        // Usar componentes individualmente
        System.out.println("Cliente: Operación en una hoja:");
        clientCode(leaf1);
        System.out.println();
        
        // Usar la estructura compuesta
        System.out.println("Cliente: Operación en un compuesto complejo:");
        clientCode(composite1);
        System.out.println();
        
        // Demostración del visitor usando lambda de Java 8
        System.out.println("Visitor: Listando todos los componentes:");
        composite1.accept(component -> {
            System.out.println(" - " + component.getName());
        });
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos las clases necesarias, incluyendo Consumer para implementar el patrón Visitor.' },
        { line: 5, text: 'Definimos una interfaz Component con todos los métodos necesarios para hojas y compuestos.' },
        { line: 7, text: 'Los métodos add/remove son parte de la interfaz, aunque no tengan implementación útil en las hojas.' },
        { line: 9, text: 'Incluimos métodos para manejar relaciones padre-hijo, permitiendo navegación bidireccional.' },
        { line: 15, text: 'Implementación de Leaf (hoja) que representa objetos individuales sin hijos.' },
        { line: 25, text: 'La operación en una hoja simplemente imprime su nombre.' },
        { line: 30, text: 'Las operaciones add/remove lanzan excepciones ya que no son aplicables para hojas.' },
        { line: 40, text: 'Implementamos isComposite para facilitar la comprobación del tipo sin usar instanceof.' },
        { line: 56, text: 'Implementación de Composite que puede contener otros componentes.' },
        { line: 58, text: 'Usamos ArrayList para almacenar los componentes hijos.' },
        { line: 66, text: 'La operación en un compuesto recorre recursivamente todos sus hijos.' },
        { line: 76, text: 'Al añadir un componente, establecemos una relación bidireccional con setParent.' },
        { line: 82, text: 'Al eliminar un componente, limpiamos la referencia al padre.' },
        { line: 100, text: 'Implementamos un método accept que implementa el patrón Visitor usando Consumer de Java 8.' },
        { line: 102, text: 'El visitor se aplica primero al componente actual y luego recursivamente a los hijos.' },
        { line: 114, text: 'Clase de demostración que muestra el uso del patrón Composite.' },
        { line: 135, text: 'Construimos una estructura jerárquica anidando compuestos y hojas.' },
        { line: 152, text: 'Demostramos el uso del visitor con una lambda de Java 8 que imprime los nombres.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Gestión de memoria',
      cppTraditional: 'Requiere gestión manual de memoria con new/delete. Riesgo de fugas de memoria si no se maneja correctamente la propiedad de los componentes hijos.',
      cppModern: 'Usa punteros inteligentes (shared_ptr/weak_ptr) para gestión automática de memoria, evitando fugas y referencias circulares.',
      java: 'La memoria es gestionada automáticamente por el recolector de basura de Java.'
    },
    {
      title: 'Relación padre-hijo',
      cppTraditional: 'No implementa una relación bidireccional por defecto. Requiere código adicional para mantener referencias al padre.',
      cppModern: 'Implementa relación bidireccional usando weak_ptr para el padre, evitando referencias circulares.',
      java: 'Fácil implementación de relaciones bidireccionales sin preocupaciones por referencias circulares debido al recolector de basura.'
    },
    {
      title: 'Seguridad tipográfica',
      cppTraditional: 'Fuerte tipado en tiempo de compilación, pero susceptible a errores de puntero nulo.',
      cppModern: 'Mantiene fuerte tipado y añade seguridad con punteros inteligentes que previenen accesos a memoria liberada.',
      java: 'Fuerte tipado con comprobaciones en tiempo de ejecución para prevenir NullPointerException.'
    },
    {
      title: 'Extensibilidad',
      cppTraditional: 'Requiere modificar clases existentes para añadir nuevas operaciones.',
      cppModern: 'Integra patrón Visitor con functores/lambdas para añadir operaciones sin modificar clases existentes.',
      java: 'Permite implementar Visitor con interfaces funcionales de Java 8 para extender funcionalidad.'
    },
    {
      title: 'Rendimiento',
      cppTraditional: 'Mayor rendimiento potencial, pero con mayor responsabilidad en gestión de memoria.',
      cppModern: 'Ligera sobrecarga por punteros inteligentes, pero con mayor seguridad y prevención de fugas.',
      java: 'Puede tener sobrecarga del recolector de basura, aunque las JVM modernas están altamente optimizadas.'
    }
  ],
  
  theory: {
    background: 'El patrón Composite fue introducido por el Gang of Four (GoF) como una solución para representar jerarquías parte-todo. Se inspira en estructuras de árbol donde los elementos pueden ser simples o compuestos.',
    problem: 'Necesitamos tratar colecciones de objetos de la misma manera que trataríamos un único objeto. Es decir, queremos ignorar las diferencias entre composiciones de objetos y objetos individuales, lo que complica el código cliente.',
    solution: 'El patrón Composite compone objetos en estructuras de árbol para representar jerarquías parte-todo. Permite a los clientes tratar objetos individuales y composiciones de manera uniforme a través de una interfaz común.',
    applicability: [
      'Cuando quieres representar jerarquías parte-todo de objetos.',
      'Cuando quieres que los clientes ignoren la diferencia entre composiciones de objetos y objetos individuales.',
      'Cuando la estructura puede tener cualquier nivel de complejidad y anidamiento.',
      'Cuando quieres que el código cliente funcione con todos los objetos en la jerarquía de manera uniforme.'
    ],
    consequences: [
      'Define jerarquías de clases consistentes de objetos primitivos y complejos.',
      'Facilita añadir nuevos tipos de componentes que funcionan automáticamente con el código existente.',
      'Hace el código cliente más simple, trabajando con una interfaz uniforme.',
      'Puede hacer el diseño demasiado general, dificultando restringir ciertos componentes.',
      'Puede complicar el diseño cuando los componentes hoja y compuestos tienen comportamientos muy diferentes.'
    ]
  },
  
  notes: 'El patrón Composite se utiliza ampliamente en interfaces gráficas de usuario, sistemas de archivos, estructuras organizacionales y cualquier escenario donde existan jerarquías parte-todo. Un desafío común en la implementación es decidir dónde colocar la responsabilidad de gestionar hijos (en la interfaz Component o solo en Composite). La elección depende del equilibrio deseado entre seguridad y transparencia.'
};

export default compositePattern;
