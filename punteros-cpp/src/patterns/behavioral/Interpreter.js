const interpreterPattern = {
  id: 'interpreter',
  name: 'Interpreter',
  category: 'behavioral',
  description: 'Define una representación gramatical para un lenguaje y proporciona un intérprete para evaluar expresiones en ese lenguaje.',
  
  theory: {
    background: 'Cuando necesitamos procesar lenguajes simples o DSLs (Lenguajes Específicos de Dominio), el patrón Interpreter proporciona una forma estructurada de hacerlo.',
    problem: 'Necesitamos evaluar expresiones o sentencias en un lenguaje simple, pero incluir un analizador completo sería excesivo.',
    solution: 'Definir una gramática para el lenguaje y representar cada regla gramatical como una clase. Luego usar estas clases para interpretar expresiones en el lenguaje.',
    applicability: [
      "Cuando la gramática del lenguaje es relativamente simple",
      "Cuando la eficiencia no es una preocupación crítica",
      "Cuando necesitas interpretar expresiones recurrentes o frecuentes",
      "Cuando puedes representar las sentencias del lenguaje como un árbol sintáctico abstracto (AST)"
    ],
    consequences: [
      "Facilita implementar y extender la gramática de un lenguaje simple",
      "Permite representar cada regla gramatical como una clase, haciendo el código modular",
      "Puede volverse complejo para gramáticas grandes o complicadas",
      "Normalmente tiene un rendimiento limitado, no adecuado para lenguajes complejos",
      "Es difícil de mantener si la gramática cambia frecuentemente"
    ]
  },
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>
#include <map>
#include <memory>
#include <vector>

// Contexto que contiene la información global
class Context {
private:
    std::map<std::string, int> variables;

public:
    void setVariable(const std::string& name, int value) {
        variables[name] = value;
    }
    
    int getVariable(const std::string& name) const {
        auto it = variables.find(name);
        if (it != variables.end()) {
            return it->second;
        }
        return 0; // Valor por defecto si la variable no existe
    }
};

// Interfaz Expression abstracta
class Expression {
public:
    virtual ~Expression() {}
    virtual int interpret(const Context& context) const = 0;
};

// Expresión Terminal para números enteros
class NumberExpression : public Expression {
private:
    int number;

public:
    NumberExpression(int number) : number(number) {}
    
    int interpret(const Context& context) const override {
        return number;
    }
};

// Expresión Terminal para variables
class VariableExpression : public Expression {
private:
    std::string name;

public:
    VariableExpression(const std::string& name) : name(name) {}
    
    int interpret(const Context& context) const override {
        return context.getVariable(name);
    }
};

// Expresión No Terminal para la suma
class AddExpression : public Expression {
private:
    Expression* leftExpression;
    Expression* rightExpression;

public:
    AddExpression(Expression* left, Expression* right) 
        : leftExpression(left), rightExpression(right) {}
    
    ~AddExpression() override {
        delete leftExpression;
        delete rightExpression;
    }
    
    int interpret(const Context& context) const override {
        return leftExpression->interpret(context) + rightExpression->interpret(context);
    }
};

// Expresión No Terminal para la resta
class SubtractExpression : public Expression {
private:
    Expression* leftExpression;
    Expression* rightExpression;

public:
    SubtractExpression(Expression* left, Expression* right) 
        : leftExpression(left), rightExpression(right) {}
    
    ~SubtractExpression() override {
        delete leftExpression;
        delete rightExpression;
    }
    
    int interpret(const Context& context) const override {
        return leftExpression->interpret(context) - rightExpression->interpret(context);
    }
};

// Cliente que usa el patrón Interpreter
int main() {
    // Definir el contexto
    Context context;
    context.setVariable("x", 10);
    context.setVariable("y", 5);
    
    // Construir el árbol sintáctico para la expresión "x + (y - 2)"
    Expression* expression = new AddExpression(
        new VariableExpression("x"),
        new SubtractExpression(
            new VariableExpression("y"),
            new NumberExpression(2)
        )
    );
    
    // Interpretar la expresión
    int result = expression->interpret(context);
    std::cout << "Resultado de x + (y - 2): " << result << std::endl;
    
    // Liberar memoria
    delete expression;
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las cabeceras necesarias para nuestro intérprete.' },
        { line: 7, text: 'Definimos la clase Context que almacena el estado durante la interpretación, como variables y sus valores.' },
        { line: 9, text: 'Usamos un mapa para asociar nombres de variables con sus valores enteros.' },
        { line: 12, text: 'Método para establecer el valor de una variable en el contexto.' },
        { line: 16, text: 'Método para obtener el valor de una variable del contexto.' },
        { line: 25, text: 'Definimos la interfaz abstracta Expression que todas las expresiones implementarán.' },
        { line: 27, text: 'Destructor virtual para asegurar la correcta liberación de memoria en la jerarquía de clases.' },
        { line: 28, text: 'Método interpret virtual puro que las clases concretas deben implementar.' },
        { line: 32, text: 'NumberExpression: expresión terminal que representa un número literal.' },
        { line: 38, text: 'Su interpretación simplemente devuelve el valor numérico almacenado.' },
        { line: 42, text: 'VariableExpression: expresión terminal que representa una variable.' },
        { line: 48, text: 'Su interpretación busca el valor de la variable en el contexto.' },
        { line: 52, text: 'AddExpression: expresión no terminal que representa la suma de dos expresiones.' },
        { line: 58, text: 'Constructor que toma dos subexpresiones para sumar.' },
        { line: 61, text: 'Destructor que libera la memoria de las subexpresiones, necesario en C++ tradicional.' },
        { line: 66, text: 'La interpretación consiste en interpretar ambas subexpresiones y sumar los resultados.' },
        { line: 70, text: 'SubtractExpression: expresión no terminal que representa la resta de dos expresiones.' },
        { line: 85, text: 'La interpretación consiste en interpretar ambas subexpresiones y restar los resultados.' },
        { line: 90, text: 'Cliente que demuestra el uso del patrón Interpreter.' },
        { line: 92, text: 'Creamos un contexto y establecemos valores para las variables "x" e "y".' },
        { line: 96, text: 'Construimos manualmente el árbol sintáctico para la expresión "x + (y - 2)".' },
        { line: 104, text: 'Interpretamos la expresión, lo que evaluará recursivamente todo el árbol.' },
        { line: 107, text: 'Liberamos la memoria del árbol de expresiones, lo que desencadenará la liberación recursiva.' }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <map>
#include <memory>
#include <vector>
#include <functional>

// Contexto que contiene la información global
class Context {
private:
    std::map<std::string, int> variables;

public:
    void setVariable(const std::string& name, int value) {
        variables[name] = value;
    }
    
    int getVariable(const std::string& name) const {
        auto it = variables.find(name);
        return it != variables.end() ? it->second : 0;
    }
};

// Interfaz Expression abstracta
class Expression {
public:
    virtual ~Expression() = default;
    virtual int interpret(const Context& context) const = 0;
};

// Expresión Terminal para números enteros
class NumberExpression : public Expression {
private:
    int number;

public:
    explicit NumberExpression(int number) : number(number) {}
    
    int interpret(const Context& context) const override {
        return number;
    }
};

// Expresión Terminal para variables
class VariableExpression : public Expression {
private:
    std::string name;

public:
    explicit VariableExpression(std::string name) : name(std::move(name)) {}
    
    int interpret(const Context& context) const override {
        return context.getVariable(name);
    }
};

// Expresión No Terminal para operaciones binarias
class BinaryExpression : public Expression {
private:
    std::shared_ptr<Expression> left;
    std::shared_ptr<Expression> right;
    std::function<int(int, int)> operation;
    
public:
    BinaryExpression(std::shared_ptr<Expression> left, 
                      std::shared_ptr<Expression> right,
                      std::function<int(int, int)> operation)
        : left(std::move(left)), right(std::move(right)), operation(std::move(operation)) {}
                      
    int interpret(const Context& context) const override {
        return operation(left->interpret(context), right->interpret(context));
    }
};

// Funciones auxiliares para crear expresiones específicas
std::shared_ptr<Expression> number(int value) {
    return std::make_shared<NumberExpression>(value);
}

std::shared_ptr<Expression> variable(const std::string& name) {
    return std::make_shared<VariableExpression>(name);
}

std::shared_ptr<Expression> add(std::shared_ptr<Expression> left, std::shared_ptr<Expression> right) {
    return std::make_shared<BinaryExpression>(std::move(left), std::move(right), 
                                            std::plus<int>());
}

std::shared_ptr<Expression> subtract(std::shared_ptr<Expression> left, std::shared_ptr<Expression> right) {
    return std::make_shared<BinaryExpression>(std::move(left), std::move(right), 
                                            std::minus<int>());
}

// Funciones adicionales para más operaciones
std::shared_ptr<Expression> multiply(std::shared_ptr<Expression> left, std::shared_ptr<Expression> right) {
    return std::make_shared<BinaryExpression>(std::move(left), std::move(right), 
                                            std::multiplies<int>());
}

std::shared_ptr<Expression> divide(std::shared_ptr<Expression> left, std::shared_ptr<Expression> right) {
    return std::make_shared<BinaryExpression>(std::move(left), std::move(right), 
                                            [](int a, int b) { return b != 0 ? a / b : 0; });
}

// Cliente que usa el patrón Interpreter
int main() {
    // Definir el contexto
    Context context;
    context.setVariable("x", 10);
    context.setVariable("y", 5);
    
    // Construir el árbol sintáctico para la expresión "x + (y - 2)"
    auto expression = add(
        variable("x"),
        subtract(
            variable("y"),
            number(2)
        )
    );
    
    // Interpretar la expresión
    int result = expression->interpret(context);
    std::cout << "Resultado de x + (y - 2): " << result << std::endl;
    
    // Una expresión más compleja: ((x * y) - (y / 2))
    auto complexExpression = subtract(
        multiply(variable("x"), variable("y")),
        divide(variable("y"), number(2))
    );
    
    int complexResult = complexExpression->interpret(context);
    std::cout << "Resultado de ((x * y) - (y / 2)): " << complexResult << std::endl;
    
    // No es necesario liberar memoria manualmente gracias a shared_ptr
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las cabeceras necesarias, incluyendo <functional> para usar std::function y operadores predefinidos.' },
        { line: 8, text: 'Definimos la clase Context, similar a la versión tradicional pero con sintaxis más concisa.' },
        { line: 17, text: 'Usamos el operador ternario para simplificar el retorno del valor o un valor por defecto.' },
        { line: 22, text: 'Interfaz Expression con destructor virtual usando "= default" de C++11.' },
        { line: 33, text: 'Usamos la palabra clave "explicit" para evitar conversiones implícitas no deseadas.' },
        { line: 42, text: 'En la clase VariableExpression, ahora usamos std::move para transferir la propiedad del string.' },
        { line: 49, text: 'Implementamos una BinaryExpression genérica que puede representar cualquier operación binaria.' },
        { line: 52, text: 'Usamos std::shared_ptr para la gestión automática de memoria de las subexpresiones.' },
        { line: 53, text: 'Usamos std::function para almacenar cualquier operación binaria como un objeto función.' },
        { line: 58, text: 'Constructor que toma subexpresiones y una operación, usando std::move para transferir la propiedad.' },
        { line: 63, text: 'La interpretación aplica la operación almacenada a los resultados de interpretar las subexpresiones.' },
        { line: 68, text: 'Definimos funciones auxiliares para crear expresiones específicas, mejorando la legibilidad del código.' },
        { line: 72, text: 'Función para crear expresiones numéricas usando std::make_shared.' },
        { line: 80, text: 'Función para crear expresiones de suma, utilizando std::plus<int>() de la STL.' },
        { line: 85, text: 'Función para crear expresiones de resta, utilizando std::minus<int>() de la STL.' },
        { line: 90, text: 'Añadimos funciones para crear expresiones de multiplicación y división.' },
        { line: 95, text: 'Para la división, usamos una lambda para manejar la división por cero.' },
        { line: 105, text: 'El cliente crea un contexto similar a la versión tradicional.' },
        { line: 109, text: 'Construimos el árbol sintáctico usando las funciones auxiliares, resultando en código más legible.' },
        { line: 118, text: 'Demostramos una expresión más compleja utilizando las funciones adicionales.' },
        { line: 126, text: 'No necesitamos liberar memoria manualmente gracias a los shared_ptr.' }
      ]
    },
    java: {
      code: `import java.util.HashMap;
import java.util.Map;
import java.util.function.BinaryOperator;

// Contexto que contiene la información global
class Context {
    private Map<String, Integer> variables = new HashMap<>();
    
    public void setVariable(String name, int value) {
        variables.put(name, value);
    }
    
    public int getVariable(String name) {
        return variables.getOrDefault(name, 0);
    }
}

// Interfaz Expression
interface Expression {
    int interpret(Context context);
}

// Expresión Terminal para números enteros
class NumberExpression implements Expression {
    private final int number;
    
    public NumberExpression(int number) {
        this.number = number;
    }
    
    @Override
    public int interpret(Context context) {
        return number;
    }
}

// Expresión Terminal para variables
class VariableExpression implements Expression {
    private final String name;
    
    public VariableExpression(String name) {
        this.name = name;
    }
    
    @Override
    public int interpret(Context context) {
        return context.getVariable(name);
    }
}

// Expresión No Terminal para operaciones binarias
class BinaryExpression implements Expression {
    private final Expression left;
    private final Expression right;
    private final BinaryOperator<Integer> operation;
    
    public BinaryExpression(Expression left, Expression right, BinaryOperator<Integer> operation) {
        this.left = left;
        this.right = right;
        this.operation = operation;
    }
    
    @Override
    public int interpret(Context context) {
        return operation.apply(left.interpret(context), right.interpret(context));
    }
}

// Clase Helper con métodos estáticos para crear expresiones más fácilmente
class ExpressionBuilder {
    public static Expression number(int value) {
        return new NumberExpression(value);
    }
    
    public static Expression variable(String name) {
        return new VariableExpression(name);
    }
    
    public static Expression add(Expression left, Expression right) {
        return new BinaryExpression(left, right, (a, b) -> a + b);
    }
    
    public static Expression subtract(Expression left, Expression right) {
        return new BinaryExpression(left, right, (a, b) -> a - b);
    }
    
    public static Expression multiply(Expression left, Expression right) {
        return new BinaryExpression(left, right, (a, b) -> a * b);
    }
    
    public static Expression divide(Expression left, Expression right) {
        return new BinaryExpression(left, right, (a, b) -> b != 0 ? a / b : 0);
    }
}

// Clase principal de demostración
public class InterpreterDemo {
    public static void main(String[] args) {
        // Definir el contexto
        Context context = new Context();
        context.setVariable("x", 10);
        context.setVariable("y", 5);
        
        // Usando las clases directamente
        Expression expression1 = new BinaryExpression(
            new VariableExpression("x"),
            new BinaryExpression(
                new VariableExpression("y"),
                new NumberExpression(2),
                (a, b) -> a - b
            ),
            (a, b) -> a + b
        );
        
        int result1 = expression1.interpret(context);
        System.out.println("Resultado de x + (y - 2) usando clases directamente: " + result1);
        
        // Usando el helper para una sintaxis más limpia
        Expression expression2 = ExpressionBuilder.add(
            ExpressionBuilder.variable("x"),
            ExpressionBuilder.subtract(
                ExpressionBuilder.variable("y"),
                ExpressionBuilder.number(2)
            )
        );
        
        int result2 = expression2.interpret(context);
        System.out.println("Resultado de x + (y - 2) usando builder: " + result2);
        
        // Expresión más compleja: ((x * y) - (y / 2))
        Expression complexExpression = ExpressionBuilder.subtract(
            ExpressionBuilder.multiply(
                ExpressionBuilder.variable("x"),
                ExpressionBuilder.variable("y")
            ),
            ExpressionBuilder.divide(
                ExpressionBuilder.variable("y"),
                ExpressionBuilder.number(2)
            )
        );
        
        int complexResult = complexExpression.interpret(context);
        System.out.println("Resultado de ((x * y) - (y / 2)): " + complexResult);
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos las clases necesarias, incluyendo BinaryOperator para operaciones funcionales.' },
        { line: 5, text: 'Definimos la clase Context que almacena el estado durante la interpretación.' },
        { line: 6, text: 'Usamos HashMap para almacenar las variables y sus valores.' },
        { line: 12, text: 'Usamos getOrDefault para simplificar la obtención de valores, devolviendo 0 si la variable no existe.' },
        { line: 17, text: 'Definimos la interfaz Expression que todas las expresiones implementarán.' },
        { line: 22, text: 'NumberExpression implementa Expression y representa un valor constante.' },
        { line: 24, text: 'Usamos "final" para indicar que el valor no cambiará después de la inicialización.' },
        { line: 34, text: 'VariableExpression implementa Expression y representa una variable.' },
        { line: 45, text: 'BinaryExpression implementa Expression para operaciones que tienen dos operandos.' },
        { line: 48, text: 'Usamos BinaryOperator<Integer> de Java 8 para representar operaciones binarias.' },
        { line: 58, text: 'Aplicamos la operación a los resultados de interpretar ambas subexpresiones.' },
        { line: 63, text: 'ExpressionBuilder proporciona métodos estáticos para crear expresiones de manera más legible.' },
        { line: 72, text: 'Método para crear expresiones de suma utilizando expresiones lambda de Java 8.' },
        { line: 76, text: 'Método para crear expresiones de resta.' },
        { line: 80, text: 'Métodos adicionales para multiplicación y división.' },
        { line: 84, text: 'Para la división, manejamos el caso de división por cero.' },
        { line: 89, text: 'Clase principal con método main para demostrar el patrón.' },
        { line: 91, text: 'Creamos un contexto y establecemos valores para variables.' },
        { line: 96, text: 'Primera forma de crear expresiones: usando las clases directamente.' },
        { line: 108, text: 'Segunda forma: usando los métodos del builder para mayor legibilidad.' },
        { line: 120, text: 'Demostramos una expresión más compleja utilizando los métodos del builder.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Gestión de memoria',
      cppTraditional: 'Requiere gestión manual de memoria con new y delete, lo que puede llevar a fugas de memoria si no se maneja correctamente.',
      cppModern: 'Utiliza smart pointers (shared_ptr) para la gestión automática de memoria, eliminando la necesidad de delete manual.',
      java: 'El recolector de basura se encarga automáticamente de liberar la memoria, simplificando significativamente el código.'
    },
    {
      title: 'Construcción de expresiones',
      cppTraditional: 'Requiere gestión explícita de punteros y llamadas a new, resultando en código más largo y propenso a errores.',
      cppModern: 'Proporciona funciones auxiliares y utiliza functores y std::function para crear expresiones de manera más limpia y segura.',
      java: 'Ofrece una clase builder con métodos estáticos y usa expresiones lambda para simplificar la creación de expresiones.'
    },
    {
      title: 'Extensibilidad',
      cppTraditional: 'Requiere crear una nueva clase para cada tipo de operación, resultando en una jerarquía de clases más grande.',
      cppModern: 'Usa una clase genérica BinaryExpression junto con functores para soportar cualquier operación binaria sin clases adicionales.',
      java: 'Similar al enfoque moderno de C++, utiliza BinaryOperator y lambdas para minimizar la cantidad de clases necesarias.'
    },
    {
      title: 'Características funcionales',
      cppTraditional: 'Utiliza un enfoque puramente orientado a objetos, con una clase para cada tipo de expresión.',
      cppModern: 'Combina orientación a objetos con programación funcional mediante functores, std::function y lambdas.',
      java: 'Aprovecha las características funcionales de Java 8 (lambdas, interfaces funcionales) para un código más conciso.'
    }
  ],
  
  notes: 'El patrón Interpreter es útil para crear pequeños lenguajes de dominio específico (DSLs), como expresiones matemáticas, consultas de bases de datos simples o reglas de validación. Para lenguajes más complejos, es recomendable usar herramientas especializadas como parser generators. Este patrón trabaja muy bien con el patrón Composite, ya que las expresiones típicamente forman una estructura de árbol. En aplicaciones modernas, este patrón se ha hecho más poderoso y conciso gracias a las características de programación funcional disponibles en C++ moderno y Java 8+.'
};

export default interpreterPattern; 