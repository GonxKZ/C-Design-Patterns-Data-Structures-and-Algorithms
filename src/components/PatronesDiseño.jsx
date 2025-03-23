import { motion } from 'framer-motion';

const PatronesDiseño = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Patrones de Diseño con Punteros en C++</h2>

      <div className="card">
        <h3>Introducción a Patrones de Diseño con Punteros</h3>
        <p>
          Los patrones de diseño son soluciones reutilizables a problemas comunes en el desarrollo de software.
          En C++, muchos patrones de diseño hacen uso extensivo de punteros para lograr flexibilidad, abstracción
          y optimización de recursos.
        </p>
        <p>
          Estos patrones toman ventaja de características como polimorfismo, herencia, y asignación dinámica de memoria,
          que son facilitadas por el uso de punteros.
        </p>
      </div>

      <div className="card">
        <h3>Patrón Singleton</h3>
        <p>
          El patrón Singleton garantiza que una clase tenga una única instancia y proporciona un punto de acceso global a ella.
          En C++, este patrón utiliza punteros estáticos para mantener la referencia a la instancia única.
        </p>

        <div className="code-example">
          <pre>
            <code>
{`class Singleton {
private:
    static Singleton* instance;
    // Constructor privado para prevenir instanciación directa
    Singleton() {}

public:
    // Método para acceder a la instancia única
    static Singleton* getInstance() {
        if (instance == nullptr) {
            instance = new Singleton();
        }
        return instance;
    }
    
    void someBusinessLogic() {
        // ...
    }
    
    // Destructor para liberar recursos
    ~Singleton() {
        // ...
    }
};

// Inicialización del puntero estático
Singleton* Singleton::instance = nullptr;`}
            </code>
          </pre>
        </div>

        <div className="nota">
          Este patrón tiene desafíos con la gestión de memoria. En C++ moderno, es preferible usar un puntero inteligente
          como <code>std::unique_ptr</code> con un destructor personalizado para garantizar la liberación de recursos.
        </div>
      </div>

      <div className="card">
        <h3>Patrón Factory Method</h3>
        <p>
          Este patrón proporciona una interfaz para crear objetos, pero permite a las subclases alterar el tipo de objetos que se crearán.
          Los punteros son esenciales para este patrón, ya que permiten devolver instancias polimórficas a través de punteros a una clase base.
        </p>

        <div className="code-example">
          <pre>
            <code>
{`class Product {
public:
    virtual ~Product() {}
    virtual std::string operation() const = 0;
};

class ConcreteProduct1 : public Product {
public:
    std::string operation() const override {
        return "Resultado del ConcreteProduct1";
    }
};

class ConcreteProduct2 : public Product {
public:
    std::string operation() const override {
        return "Resultado del ConcreteProduct2";
    }
};

class Creator {
public:
    virtual ~Creator() {}
    virtual Product* factoryMethod() const = 0;
    
    std::string someOperation() const {
        // Llama al factory method para crear un producto
        Product* product = this->factoryMethod();
        std::string result = product->operation();
        delete product;
        return result;
    }
};

class ConcreteCreator1 : public Creator {
public:
    Product* factoryMethod() const override {
        return new ConcreteProduct1();
    }
};

class ConcreteCreator2 : public Creator {
public:
    Product* factoryMethod() const override {
        return new ConcreteProduct2();
    }
};`}
            </code>
          </pre>
        </div>

        <div className="importante">
          En C++ moderno, es mejor utilizar punteros inteligentes como <code>std::unique_ptr</code> o <code>std::shared_ptr</code> 
          para gestionar la memoria automáticamente y evitar fugas.
        </div>
      </div>

      <div className="card">
        <h3>Patrón Observer</h3>
        <p>
          El patrón Observer define una dependencia uno-a-muchos entre objetos, de modo que cuando un objeto cambia de estado, 
          todos sus dependientes son notificados y actualizados automáticamente.
        </p>

        <div className="code-example">
          <pre>
            <code>
{`class Observer {
public:
    virtual ~Observer() {}
    virtual void update(const std::string &message) = 0;
};

class Subject {
private:
    std::vector<Observer*> observers;
    std::string message;

public:
    void attach(Observer* observer) {
        observers.push_back(observer);
    }
    
    void detach(Observer* observer) {
        observers.erase(std::remove(observers.begin(), observers.end(), observer), observers.end());
    }
    
    void notify() {
        for (Observer* observer : observers) {
            observer->update(message);
        }
    }
    
    void createMessage(const std::string& message) {
        this->message = message;
        notify();
    }
};

class ConcreteObserver : public Observer {
private:
    std::string observerState;
    Subject& subject;
    static int staticNumber;
    int number;

public:
    ConcreteObserver(Subject& subject) : subject(subject) {
        this->subject.attach(this);
        this->number = ++staticNumber;
    }
    
    ~ConcreteObserver() {
        subject.detach(this);
    }
    
    void update(const std::string &message) override {
        observerState = message;
        std::cout << "Observer " << number << " recibió: " << observerState << std::endl;
    }
};

int ConcreteObserver::staticNumber = 0;`}
            </code>
          </pre>
        </div>

        <div className="comparacion">
          <div className="cpp">
            <h4>C++</h4>
            <p>En C++, los observadores se implementan comúnmente usando punteros crudos para mantener las referencias a los objetos.</p>
          </div>
          <div className="java">
            <h4>Java</h4>
            <p>En Java, los observadores son típicamente implementados usando la interfaz Observer y las referencias a objetos son manejadas por el recolector de basura.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Patrón Strategy</h3>
        <p>
          El patrón Strategy permite definir una familia de algoritmos, encapsular cada uno, y hacerlos intercambiables. 
          Este patrón utiliza punteros a interfaces para permitir cambiar el comportamiento de un objeto en tiempo de ejecución.
        </p>

        <div className="code-example">
          <pre>
            <code>
{`// Interfaz Strategy
class Strategy {
public:
    virtual ~Strategy() {}
    virtual std::string doAlgorithm(const std::vector<std::string> &data) const = 0;
};

// Implementaciones concretas
class ConcreteStrategyA : public Strategy {
public:
    std::string doAlgorithm(const std::vector<std::string> &data) const override {
        std::string result;
        for (const auto &item : data) {
            result += item + "-";
        }
        return result;
    }
};

class ConcreteStrategyB : public Strategy {
public:
    std::string doAlgorithm(const std::vector<std::string> &data) const override {
        std::string result;
        for (auto it = data.rbegin(); it != data.rend(); ++it) {
            result += *it + "-";
        }
        return result;
    }
};

// Contexto que utiliza la estrategia
class Context {
private:
    Strategy* strategy;

public:
    Context(Strategy* strategy = nullptr) : strategy(strategy) {}
    
    ~Context() {
        delete strategy;
    }
    
    void setStrategy(Strategy* strategy) {
        delete this->strategy;
        this->strategy = strategy;
    }
    
    void doSomeBusinessLogic() const {
        if (strategy) {
            std::vector<std::string> data = {"a", "b", "c", "d", "e"};
            std::cout << "Contexto: Ordenando datos usando la estrategia" << std::endl;
            std::string result = strategy->doAlgorithm(data);
            std::cout << result << std::endl;
        }
    }
};`}
            </code>
          </pre>
        </div>

        <div className="importante">
          En C++ moderno, se recomendaría usar <code>std::unique_ptr</code> para la propiedad exclusiva de la estrategia en el contexto:
        </div>

        <div className="code-example">
          <pre>
            <code>
{`class Context {
private:
    std::unique_ptr<Strategy> strategy;

public:
    Context(std::unique_ptr<Strategy> strategy = nullptr) 
        : strategy(std::move(strategy)) {}
    
    void setStrategy(std::unique_ptr<Strategy> strategy) {
        this->strategy = std::move(strategy);
    }
    
    // ...
};`}
            </code>
          </pre>
        </div>
      </div>

      <div className="card">
        <h3>Patrón Composite</h3>
        <p>
          El patrón Composite permite componer objetos en estructuras de árbol para representar jerarquías de parte-todo.
          Este patrón utiliza punteros para mantener referencias a los componentes hijos dentro de un componente compuesto.
        </p>

        <div className="code-example">
          <pre>
            <code>
{`class Component {
protected:
    Component* parent;

public:
    virtual ~Component() {}
    void setParent(Component* parent) {
        this->parent = parent;
    }
    Component* getParent() const {
        return parent;
    }
    
    virtual void add(Component* component) {}
    virtual void remove(Component* component) {}
    virtual bool isComposite() const {
        return false;
    }
    virtual std::string operation() const = 0;
};

class Leaf : public Component {
public:
    std::string operation() const override {
        return "Leaf";
    }
};

class Composite : public Component {
protected:
    std::vector<Component*> children;

public:
    ~Composite() {
        for (auto child : children) {
            delete child;
        }
    }

    void add(Component* component) override {
        children.push_back(component);
        component->setParent(this);
    }
    
    void remove(Component* component) override {
        children.erase(
            std::remove(children.begin(), children.end(), component),
            children.end()
        );
        component->setParent(nullptr);
    }
    
    bool isComposite() const override {
        return true;
    }
    
    std::string operation() const override {
        std::string result = "Branch(";
        for (const Component* child : children) {
            if (child == children.back()) {
                result += child->operation();
            } else {
                result += child->operation() + "+";
            }
        }
        return result + ")";
    }
};`}
            </code>
          </pre>
        </div>

        <div className="aviso">
          Este código tiene riesgos de gestión de memoria. Un enfoque más seguro en C++ moderno
          sería utilizar <code>std::unique_ptr</code> o <code>std::shared_ptr</code> dependiendo
          de las necesidades de propiedad.
        </div>
      </div>

      <div className="card">
        <h3>Mejores Prácticas con Punteros en Patrones de Diseño</h3>
        <ul>
          <li><strong>Prefiere punteros inteligentes:</strong> Utiliza <code>std::unique_ptr</code> para propiedad exclusiva y <code>std::shared_ptr</code> para propiedad compartida.</li>
          <li><strong>Evita punteros crudos:</strong> Minimiza el uso de punteros crudos para reducir el riesgo de fugas de memoria.</li>
          <li><strong>Usa referencias para parámetros:</strong> Cuando solo necesites acceder a un objeto y no cambiar su propiedad, usa referencias en lugar de punteros.</li>
          <li><strong>Considera alternativas:</strong> En algunos casos, los contenedores estándar o las referencias pueden ser mejores opciones que los punteros.</li>
          <li><strong>Sé consciente del ciclo de vida:</strong> Asegúrate de que el ciclo de vida de los objetos esté bien definido cuando uses punteros en patrones de diseño.</li>
        </ul>
      </div>

      <div className="card">
        <h3>Comparación con Java</h3>
        
        <div className="tabla-comparativa">
          <table>
            <thead>
              <tr>
                <th>Patrón</th>
                <th>Implementación en C++</th>
                <th>Implementación en Java</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Singleton</td>
                <td>Usa puntero estático y control explícito de memoria</td>
                <td>Usa campo estático con inicialización segura para hilos</td>
              </tr>
              <tr>
                <td>Factory Method</td>
                <td>Retorna punteros a la clase base</td>
                <td>Retorna referencias a interfaces</td>
              </tr>
              <tr>
                <td>Observer</td>
                <td>Maneja explícitamente punteros a observadores</td>
                <td>Usa la interfaz Observer y callbacks</td>
              </tr>
              <tr>
                <td>Strategy</td>
                <td>Intercambia punteros a estrategias</td>
                <td>Intercambia objetos que implementan interfaces</td>
              </tr>
              <tr>
                <td>Composite</td>
                <td>Maneja colecciones de punteros a componentes</td>
                <td>Maneja colecciones de referencias a interfaces</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p>La principal diferencia es que en C++ el desarrollador debe gestionar explícitamente la memoria y el ciclo de vida de los objetos mediante punteros, mientras que en Java el recolector de basura se encarga automáticamente de la gestión de memoria.</p>
      </div>

      <div className="card">
        <h3>Conclusión</h3>
        <p>
          Los patrones de diseño en C++ hacen uso extensivo de punteros para lograr flexibilidad y polimorfismo.
          Sin embargo, este enfoque requiere una cuidadosa gestión de memoria para evitar problemas como fugas o
          punteros colgantes. C++ moderno ofrece punteros inteligentes que mitigan muchos de estos problemas
          mientras mantienen la eficiencia y flexibilidad que hacen de C++ un lenguaje poderoso para el desarrollo
          de software.
        </p>
      </div>
    </motion.div>
  );
};

export default PatronesDiseño; 