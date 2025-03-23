const partialApplicationPattern = {
  id: 'partial-application',
  name: 'Partial Application',
  category: 'functional',
  description: 'Transforma una función que toma múltiples argumentos en otra que toma menos argumentos al fijar algunos de los argumentos iniciales, creando una función más especializada.',
  theory: {
    background: 'La aplicación parcial es un concepto fundamental en la programación funcional, estrechamente relacionado con la currificación pero con diferencias importantes. Mientras que la currificación transforma una función de múltiples argumentos en una secuencia de funciones de un solo argumento, la aplicación parcial simplemente fija un número de argumentos y devuelve una función que espera el resto. Este concepto tiene sus raíces en el cálculo lambda y es ampliamente utilizado en lenguajes funcionales como Haskell, Scala, y Clojure.',
    problem: 'En el desarrollo de software, a menudo necesitamos crear variantes especializadas de funciones genéricas para casos de uso específicos, lo que puede llevar a: 1) Duplicación de código cuando se implementan múltiples versiones de una función similar, 2) Dificultad para reutilizar lógica común en diferentes contextos, 3) Creación manual de funciones adaptadoras con parámetros predefinidos, 4) Verbosidad innecesaria al invocar funciones con los mismos argumentos repetidamente.',
    solution: 'Implementar mecanismos que permitan fijar un subconjunto de argumentos de una función, obteniendo una nueva función que solo requiere los argumentos restantes. Una correcta implementación de aplicación parcial: a) Captura y cierra sobre los argumentos predefinidos, b) Crea una nueva función que combina los argumentos fijados con los proporcionados en la invocación, c) Mantiene el contexto (this) adecuado cuando es relevante, d) Preserva la información del tipo de retorno y parámetros cuando el lenguaje lo permite.',
    applicability: [
      'Adaptación de APIs genéricas para casos de uso específicos',
      'Creación de funciones especializadas a partir de utilidades generales',
      'Configuración de funciones de devolución de llamada (callbacks) para eventos o promesas',
      'Reducción de la verbosidad en código que invoca repetidamente una función con algunos argumentos fijos',
      'Implementación de inyecciones de dependencias en programación funcional',
      'Preparación de funciones para composición o para ser utilizadas con operaciones de orden superior como map o filter'
    ],
    consequences: [
      'Mayor reutilización de código al poder derivar múltiples funciones específicas de una misma función general',
      'Claridad y expresividad mejoradas al eliminar argumentos repetitivos o contextuales',
      'Facilita la implementación del principio de responsabilidad única para funciones',
      'Posible sobrecarga de rendimiento debido a la creación de funciones intermedias (generalmente mínima)',
      'Puede dificultar la lectura del código para desarrolladores no familiarizados con programación funcional',
      'Potenciales complicaciones con la gestión del contexto (this) en lenguajes como JavaScript'
    ]
  },
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <functional>
#include <vector>
#include <string>

// Función original con múltiples argumentos
double calcularPrecio(double precioBase, double impuesto, double descuento) {
    return precioBase * (1 + impuesto) * (1 - descuento);
}

// Implementación manual de aplicación parcial
std::function<double(double)> calcularPrecioConImpuestoYDescuento(double impuesto, double descuento) {
    return [impuesto, descuento](double precioBase) {
        return calcularPrecio(precioBase, impuesto, descuento);
    };
}

// Función genérica para aplicación parcial (variante simple)
template<typename Func, typename... BoundArgs>
auto partialApply(Func func, BoundArgs... boundArgs) {
    return [func, boundArgs...](auto... remainingArgs) {
        return func(boundArgs..., remainingArgs...);
    };
}

// Ejemplo de uso
int main() {
    // Uso manual de aplicación parcial
    auto calcularPrecioArgentina = calcularPrecioConImpuestoYDescuento(0.21, 0.0);  // IVA 21%, sin descuento
    auto calcularPrecioPromocion = calcularPrecioConImpuestoYDescuento(0.21, 0.15); // IVA 21%, descuento 15%
    
    double precioProducto = 1000.0;
    std::cout << "Precio normal en Argentina: " << calcularPrecioArgentina(precioProducto) << std::endl;
    std::cout << "Precio promocional en Argentina: " << calcularPrecioPromocion(precioProducto) << std::endl;
    
    // Uso de la función genérica de aplicación parcial
    auto formatearMensaje = [](const std::string& prefijo, const std::string& nombre, const std::string& sufijo) {
        return prefijo + " " + nombre + " " + sufijo;
    };
    
    auto saludar = partialApply(formatearMensaje, std::string("Hola,"));
    auto despedir = partialApply(formatearMensaje, std::string("Adiós,"));
    
    auto saludarCortesmente = partialApply(saludar, std::string("tenga un buen día!"));
    auto despedirCortesmente = partialApply(despedir, std::string("hasta pronto!"));
    
    std::cout << saludarCortesmente("Juan") << std::endl;
    std::cout << despedirCortesmente("María") << std::endl;
    
    return 0;
}`,
      explanation: [
        { line: 1, text: "Inclusión de cabeceras necesarias para el ejemplo." },
        { line: 7, text: "Declaración de una función original con múltiples argumentos que calcula un precio final." },
        { line: 11, text: "Implementación manual de aplicación parcial que fija los valores de impuesto y descuento." },
        { line: 12, text: "Uso de una lambda para capturar los argumentos fijados." },
        { line: 13, text: "Llamada a la función original desde la función parcialmente aplicada." },
        { line: 18, text: "Definición de una función plantilla genérica para aplicación parcial." },
        { line: 19, text: "Uso de una lambda para capturar tanto la función como los argumentos fijados." },
        { line: 20, text: "Llamada a la función original combinando argumentos fijados y restantes." },
        { line: 26, text: "Creación de una función especializada para el cálculo de precios en Argentina (con IVA 21%)." },
        { line: 27, text: "Creación de otra función especializada con un descuento adicional del 15%." },
        { line: 30, text: "Uso de las funciones especializadas con un precio base." },
        { line: 34, text: "Definición de una función lambda para formatear mensajes con un prefijo, nombre y sufijo." },
        { line: 38, text: "Aplicación parcial para crear funciones específicas de saludo y despedida." },
        { line: 41, text: "Aplicación parcial adicional para crear funciones aún más especializadas." },
        { line: 44, text: "Uso de las funciones completamente especializadas que solo requieren el nombre." }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <functional>
#include <string>
#include <vector>
#include <utility>
#include <tuple>

// Función genérica de aplicación parcial con perfect forwarding
template<typename F, typename... Args>
auto partial(F&& f, Args&&... args) {
    // Capturamos la función y los argumentos por valor para garantizar su disponibilidad
    return [f = std::forward<F>(f), tup = std::make_tuple(std::forward<Args>(args)...)]
          <typename... RemainingArgs>(RemainingArgs&&... remainingArgs) mutable {
        return std::apply([&](auto&&... boundArgs) {
            return f(std::forward<decltype(boundArgs)>(boundArgs)..., 
                    std::forward<RemainingArgs>(remainingArgs)...);
        }, tup);
    };
}

// Aplicación parcial desde la derecha (fija argumentos desde el final)
template<typename F, typename... Args>
auto partialRight(F&& f, Args&&... args) {
    return [f = std::forward<F>(f), tup = std::make_tuple(std::forward<Args>(args)...)]
          <typename... PrecedingArgs>(PrecedingArgs&&... precedingArgs) mutable {
        return std::apply([&](auto&&... boundArgs) {
            return f(std::forward<PrecedingArgs>(precedingArgs)..., 
                    std::forward<decltype(boundArgs)>(boundArgs)...);
        }, tup);
    };
}

// Funciones de ejemplo
std::string formatMessage(std::string_view prefix, std::string_view name, int id, std::string_view suffix) {
    return std::string(prefix) + " " + std::string(name) + " (" + std::to_string(id) + ") " + std::string(suffix);
}

double calculatePrice(double basePrice, double tax, double discount, bool isVIP) {
    double taxedPrice = basePrice * (1 + tax);
    double discountMultiplier = 1 - discount - (isVIP ? 0.05 : 0);
    return taxedPrice * discountMultiplier;
}

int main() {
    // Aplicación parcial desde la izquierda
    auto greet = partial(formatMessage, "Hola");
    auto greetUserWithId = partial(greet, "Usuario", 123);
    std::cout << greetUserWithId("¡Bienvenido!") << std::endl;
    
    // Aplicación parcial desde la derecha
    auto addSuffix = partialRight(formatMessage, "¡Gracias por tu visita!");
    auto addPrefixAndSuffix = partial(addSuffix, "Adiós");
    std::cout << addPrefixAndSuffix("Cliente", 456) << std::endl;
    
    // Aplicación a un caso de negocio
    auto priceCalculator = partial(calculatePrice, 1000.0, 0.21);  // Precio base 1000, IVA 21%
    auto standardCustomerPrice = priceCalculator(0.0, false);      // Sin descuento, cliente regular
    auto premiumCustomerPrice = priceCalculator(0.1, true);        // 10% descuento + 5% VIP
    
    std::cout << "Precio estándar: " << standardCustomerPrice << std::endl;
    std::cout << "Precio cliente premium: " << premiumCustomerPrice << std::endl;
    
    // Aplicación con contenedores
    std::vector<double> basePrices = {800.0, 1200.0, 1500.0};
    std::vector<double> finalPrices;
    auto discountedPriceCalculator = partial(calculatePrice, std::placeholders::_1, 0.21, 0.15, false);
    
    std::transform(basePrices.begin(), basePrices.end(), 
                  std::back_inserter(finalPrices), 
                  discountedPriceCalculator);
    
    std::cout << "Precios finales con 15% de descuento:" << std::endl;
    for (auto price : finalPrices) {
        std::cout << price << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,
      explanation: [
        { line: 8, text: "Definición de una plantilla para aplicación parcial con perfect forwarding." },
        { line: 10, text: "Uso de captura por valor para garantizar la disponibilidad de la función y los argumentos." },
        { line: 11, text: "Función lambda con una plantilla que acepta los argumentos restantes." },
        { line: 12, text: "Uso de std::apply para desarrollar la tupla de argumentos fijados." },
        { line: 13, text: "Combinación de argumentos fijados y restantes para llamar a la función original." },
        { line: 20, text: "Implementación de aplicación parcial desde la derecha, fijando los últimos argumentos en lugar de los primeros." },
        { line: 33, text: "Ejemplo de función con múltiples argumentos para formatear mensajes." },
        { line: 37, text: "Función de ejemplo para calcular precios con varios parámetros." },
        { line: 44, text: "Uso de aplicación parcial para crear una función de saludo." },
        { line: 45, text: "Aplicación parcial adicional para especificar más parámetros." },
        { line: 49, text: "Uso de aplicación parcial desde la derecha para fijar el sufijo del mensaje." },
        { line: 53, text: "Aplicación al cálculo de precios con parámetros comerciales." },
        { line: 54, text: "Fijación del precio base e impuesto, dejando variable el descuento y estado VIP." },
        { line: 60, text: "Aplicación con contenedores usando std::transform." },
        { line: 61, text: "Vector de precios base para procesar." },
        { line: 63, text: "Uso de std::placeholders para dejar un parámetro variable mientras se fijan los demás." },
        { line: 65, text: "Transformación de cada precio base usando la función parcialmente aplicada." }
      ]
    },
    java: {
      code: `import java.util.Arrays;
import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;

public class PartialApplicationExample {
    
    // Interfaces funcionales para diferentes aridades
    @FunctionalInterface
    interface TriFunction<A, B, C, R> {
        R apply(A a, B b, C c);
    }
    
    @FunctionalInterface
    interface QuadFunction<A, B, C, D, R> {
        R apply(A a, B b, C c, D d);
    }
    
    // Métodos de aplicación parcial para diferentes aridades
    public static <A, B, C, R> Function<C, R> partial(TriFunction<A, B, C, R> f, A a, B b) {
        return c -> f.apply(a, b, c);
    }
    
    public static <A, B, C, R> BiFunction<B, C, R> partial(TriFunction<A, B, C, R> f, A a) {
        return (b, c) -> f.apply(a, b, c);
    }
    
    public static <A, B, C, D, R> TriFunction<B, C, D, R> partial(QuadFunction<A, B, C, D, R> f, A a) {
        return (b, c, d) -> f.apply(a, b, c, d);
    }
    
    // Funciones de utilidad
    private static final QuadFunction<String, String, Integer, String, String> formatMessage = 
        (prefix, name, id, suffix) -> prefix + " " + name + " (" + id + ") " + suffix;
    
    private static final QuadFunction<Double, Double, Double, Boolean, Double> calculatePrice = 
        (basePrice, tax, discount, isVIP) -> {
            double taxedPrice = basePrice * (1 + tax);
            double discountMultiplier = 1 - discount - (isVIP ? 0.05 : 0);
            return taxedPrice * discountMultiplier;
        };
        
    public static void main(String[] args) {
        // Aplicación parcial con funciones de mensaje
        Function<String, String> greetWithIdAndName = partial(formatMessage, "Hola", "Usuario", 123);
        String greeting = greetWithIdAndName.apply("¡Bienvenido!");
        System.out.println(greeting);
        
        // Aplicación parcial progresiva
        BiFunction<String, Integer, String> greet = partial(formatMessage, "Hola");
        Function<Integer, String> greetJuan = partial(greet::apply, "Juan");
        System.out.println(greetJuan.apply(456, "¡Encantado de conocerte!"));
        
        // Aplicación a cálculo de precios
        BiFunction<Double, Boolean, Double> priceWithTaxAndDiscount = 
            partial(calculatePrice, 1000.0, 0.21);
        
        double standardPrice = priceWithTaxAndDiscount.apply(0.0, false);  // Sin descuento, cliente normal
        double premiumPrice = priceWithTaxAndDiscount.apply(0.1, true);    // 10% descuento + 5% VIP
        
        System.out.println("Precio estándar: " + standardPrice);
        System.out.println("Precio premium: " + premiumPrice);
        
        // Aplicación con streams
        List<Double> basePrices = Arrays.asList(800.0, 1200.0, 1500.0);
        Function<Double, Double> discountedPriceCalculator = 
            basePrice -> calculatePrice.apply(basePrice, 0.21, 0.15, false);
        
        List<Double> finalPrices = basePrices.stream()
            .map(discountedPriceCalculator)
            .collect(Collectors.toList());
        
        System.out.println("Precios finales con 15% de descuento: " + finalPrices);
        
        // Simulación de configuración por entorno
        Function<String, BiFunction<Double, Double, Double>> createPriceCalculatorForRegion = 
            region -> {
                double taxRate = region.equals("EU") ? 0.21 : (region.equals("US") ? 0.07 : 0.0);
                return (basePrice, discount) -> calculatePrice.apply(basePrice, taxRate, discount, false);
            };
            
        BiFunction<Double, Double, Double> euCalculator = createPriceCalculatorForRegion.apply("EU");
        BiFunction<Double, Double, Double> usCalculator = createPriceCalculatorForRegion.apply("US");
        
        System.out.println("Precio en EU: " + euCalculator.apply(1000.0, 0.0));
        System.out.println("Precio en US: " + usCalculator.apply(1000.0, 0.0));
    }
}`,
      explanation: [
        { line: 9, text: "Definición de interfaces funcionales personalizadas para soportar funciones con más de dos argumentos." },
        { line: 19, text: "Método estático para aplicación parcial de una función de tres argumentos, fijando los dos primeros." },
        { line: 23, text: "Método para aplicación parcial de una función de tres argumentos, fijando solo el primero." },
        { line: 27, text: "Método para aplicación parcial de una función de cuatro argumentos, fijando el primero." },
        { line: 32, text: "Definición de una función de utilidad para formatear mensajes con cuatro parámetros." },
        { line: 35, text: "Definición de una función para calcular precios con múltiples parámetros." },
        { line: 42, text: "Uso de aplicación parcial para crear una función de saludo con ID y nombre ya fijados." },
        { line: 46, text: "Aplicación parcial progresiva, primero fijando el prefijo, luego el nombre." },
        { line: 47, text: "Uso de referencias a métodos (::apply) para la aplicación parcial." },
        { line: 51, text: "Aplicación parcial para cálculo de precios, fijando precio base e impuesto." },
        { line: 54, text: "Uso de la función parcialmente aplicada con diferentes combinaciones de parámetros." },
        { line: 61, text: "Aplicación con streams y lambdas para procesar una lista de precios." },
        { line: 62, text: "Creación de una función que aplica parcialmente calculatePrice, dejando variable el precio base." },
        { line: 68, text: "Uso avanzado para crear calculadoras de precio según región." },
        { line: 69, text: "Función de orden superior que devuelve una función parcialmente aplicada según el parámetro región." },
        { line: 75, text: "Creación de calculadoras específicas para diferentes regiones." }
      ]
    }
  },
  comparisons: [
    {
      title: 'Implementación y Sintaxis',
      cppTraditional: 'Utilizando funciones lambda con captura por valor y std::function.',
      cppModern: 'Implementación avanzada con perfect forwarding, tuplas y std::apply para mayor eficiencia y tipo-seguridad.',
      java: 'A través de interfaces funcionales personalizadas y métodos estáticos helper.'
    },
    {
      title: 'Manejo de Tipos',
      cppTraditional: 'Tipado estático con inferencia de tipo usando auto para las funciones resultantes.',
      cppModern: 'Preservación completa de tipos con plantillas variádicas y perfect forwarding.',
      java: 'Sistema de tipos basado en interfaces funcionales genéricas con distintas aridades.'
    },
    {
      title: 'Flexibilidad',
      cppTraditional: 'Limitado a aplicación parcial desde la izquierda (primeros argumentos).',
      cppModern: 'Soporta aplicación parcial desde izquierda y derecha, y con placeholders para argumentos intermedios.',
      java: 'Principalmente aplicación desde la izquierda, requiere implementaciones adicionales para otras variantes.'
    },
    {
      title: 'Rendimiento',
      cppTraditional: 'Buen rendimiento con posible overhead por copias de argumentos.',
      cppModern: 'Rendimiento optimizado mediante perfect forwarding y evitando copias innecesarias.',
      java: 'Rendimiento afectado por la necesidad de boxing/unboxing para tipos primitivos y creación de objetos.'
    }
  ],
  notes: 'La aplicación parcial es un mecanismo poderoso para especializar funciones genéricas y reducir la duplicación de código. A diferencia de la currificación, que transforma una función de n argumentos en n funciones de un argumento, la aplicación parcial simplemente fija algunos argumentos y devuelve una función que acepta los restantes. Este patrón es particularmente útil en programación funcional y en escenarios donde ciertas configuraciones o contextos se mantienen constantes a través de múltiples invocaciones. En lenguajes con tipado estático como C++, la implementación moderna con plantillas variádicas ofrece una solución elegante y eficiente, mientras que en Java las interfaces funcionales y lambdas permiten una implementación más limpia que versiones anteriores al JDK 8.'
};

export default partialApplicationPattern; 