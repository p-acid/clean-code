---
sidebar_position: 6
---

# 6장. 객체와 자료 구조

<br/>

## 들어가며

---

남들이 변수에 의존하지 않게 만들고 싶어 변수를 비공개(`private`)로 정의할 수 있지만, 왜 수많은 프로그래머가 **조회(`get`) 함수와 설정(`set`) 당연하게 공개할까?**

<br/>

## 자료 추상화

---

```java
// 구체적인 Point 클래스
public class Point {
  public double x;
  public double y;
}

// 추상적인 Point 클래스
public interface Point {
  double getX();
  double getY();
  void setCartesian(double x, double y);
  double getR();
  double getTheta();
  void setPolar(double r, double theta);
}
```

후자는 구현을 완전히 숨긴다. 그에 반해 전자는 내부 구조를 노출하고, 개별적으로 좌표값을 읽고 설정하게 강제한다.

- 일반적으로 변수를 `private` 으로 많이 선언을 하는데, 각 값마다 `get` 과 `set` 함수를 제공한다면 이는 결과적으로 내부 구조를 노출하는 구조가 된다.

변수 사이에 함수라는 계층을 계층을 넣는다고 구현이 저절로 감춰지지는 않는다.

- 구현을 감추려면 추상화가 필요하다!
- `set`, `get` 메서드로 변수를 다룬다고 클래스가 되는 것이 아니라, 추상 인터페이스를 제공해 사용자가 구현을 모른 채 자료의 핵심을 조작할 수 있어야 진정한 의미의 클래스다.

자료를 세세하게 공개하기 보다는 추상적인 개념으로 표현하는 편이 좋다.

<br/>

## 자료/객체 비대칭

---

1. 객체는 추상화 뒤로 자료를 숨긴 채 자료를 다루는 함수만 공개한다.
2. 자료 구조는 자료를 그대로 공개하며 별다른 함수는 제공하지 않는다.

두 정의는 본질적으로 상반된다. 두 개념은 사실상 정반대다. 사소한 차이로 보일지 모르지만 그 차이가 미치는 영향은 굉장하다.

```java
// 절차적인 도형 (Procedural Shape)
public class Square {
  public Point topLeft;
  public double side;
}

public class Rectangle {
  public Point topLeft;
  public double height;
  public double width;
}

public class Circle {
  public Point center;
  public double radius;
}

public class Geometry {
  public final double PI = 3.141592653589793;

  public double area(Object shape) throws NoSuchShapeException {
    if (shape instanceof Square) {
      Square s = (Square)shape;
      return s.side * s.side;
    } else if (shape instanceof Rectangle) {
      Rectangle r = (Rectangle)shape;
      return r.height * r.width;
    } else if (shape instanceof Circle) {
      Circle c = (Circle)shape;
      return PI * c.radius * c.radius;
    }
    throw new NoSuchShapeException();
  }
}
```

```java
// 다형적인 도형 (Polymorphic Shape)
public class Square implements Shape {
  private Point topLeft;
  private double side;

  public double area() {
    return side * side;
  }
}

public class Rectangle implements Shape {
  private Point topLeft;
  private double height;
  private double width;

  public double area() {
    return height * width;
  }
}

public class Circle implements Shape {
  private Point center;
  private double radius;
  public final double PI = 3.141592653589793;

  public double area() {
    return PI * radius * radius;
  }
}
```

두 방식은 사실상 반대이기에, 객체와 자료 구조는 근본적으로 다음과 같이 양분된다.

> (자료 구조를 사용하는) 절차적인 코드는 기존 자료 구조를 변경하지 않으면서 새 함수를 추가하기 쉽다. 반면, 객체 지향 코드는 기존 함수를 변경하지 않으면서 새 클래스를 추가하기 쉽다.

> 절차적인 코드는 새로운 자료 구조를 추가하기 어렵다. 그러려면 모든 함수를 고쳐야 한다. 객체 지향 코드는 새로운 함수를 추가하기 어렵다. 그러려면 모든 클래스를 고쳐야 한다.

다시 말해, 객체 지향 코드에서 어려운 변경은 절차적인 코드에서 쉬우며, 절차적인 코드에서 어려운 변경은 객체 지향 코드에서 쉽다!

<br/>

## 디미터 법칙

---

**디미터 법칙**은 잘 알려진 휴리스틱heuristic(경험에 기반하여 문제를 해결하거나 학습하거나 발견해 내는 방법)으로, 모듈은 자신이 조작하는 객체의 속사정을 몰라야 한다는 법칙이다.

좀 더 정확히 표현하자면, 디미터 법칙은 클래스 `C` 의 메서드 `f` 는 다음과 같은 객체의 메서드만 호출해야 한다고 주장한다.

- 클래스 `C`
- `f` 가 생성한 객체
- `f` 인수로 넘어온 객체
- `C` 인스턴스 변수에 저장된 객체

하지만 위 객체에서 허용된 메서드가 반환하는 객체의 메서드는 호출하면 안 된다. 다시 말해, **낯선 사람은 경계하고 친구랑만 놀라는 의미이다.**

<br/>

### 기차 충돌

---

```java
final String outputDir = ctxt.getOptions().getScratchDir().getAbsolutePath();
```

위와 같은 코드를 **기차 충돌(train wreck)**이라 부른다.

일반적으로 조잡하다 여겨지는 방식이므로 피하는 편이 좋으며, 위 코드의 경우 다음과 같이 나누는 편이 좋다.

```java
Options opts = ctxt.getOptions();
File scratchDir = opts.getScratchDir();
final String outputDir = scratchDir.getAbsolutePath();
```

위 예제가 디미터 법칙을 위반하는지 여부는 **위의 변수들이 객체인지 자료 구조인지**에 달렸다.

- 객체라면 내부 구조를 숨겨야 하므로 확실히 디미터 법칙을 위반한다.
- 반면, 자료 구조라면 당연히 내부 구조를 노출하므로 문제되지 않는다.

코드를 다음과 같이 구현한다면 디미터 법칙을 거론할 필요가 없어진다.

```java
final String outputDir = ctxt.options.scratchDir.absolutePath;
```

<br/>

### 자료 구조

---

이런 혼란으로 말미암아 때때로 절반은 객체, 절반은 자료 구조인 잡종 구조가 나온다.

- 잡종 구조는 중요한 기능을 수행하는 함수도 있고, 공개 변수나 공개 `get`/`set` 함수도 있다.
- 이런 구조는 새로운 함수는 물론이고 새로운 자료 구조도 추가하기 어렵다.

프로그래머가 함수나 타입을 보호할지 공개할지 확신하지 못해 (더 나쁘게는 무지해) **어중간하게 내놓은 설계**에 불과하다.

<br/>

### 구조체 감추기

---

만약 `ctxt`, `options`, `scratchDir` 이 진짜 객체라면, 내부 구조를 감춰야 하기 때문에 앞선 예제인 `outputDir` 과 같이 하면 안 된다.

- `ctxt` 가 객체라면 **뭔가를 하라고** 말해야지 속을 드러내라고 말하면 안 된다.

임시 디렉터리 절대 경로가 필요한 이유를 다음 코드에서 찾을 수 있었다.

```java
String outFile = outputDir + "/" + className.replace('.', '/') + ".class";
FileOutputStream fout = new FileOutputStream(outFile);
BufferedOutputStream bos = new BufferedOutputStream(fout);
```

추상화 수준을 뒤섞어 다소 불편하다. 어쨌든, 이유가 임시 파일 생성이라는 것이 드러난다.

- 그렇다면 `ctxt` 객체에 임시 파일을 생성하라고 시키면 어떨까?

```java
BufferedOutputStream bos = ctxt.createScratchFileStream(classFileName);
```

객체에게 맡기기에 적당한 임무로 보이며, `ctxt` 는 내부 구조를 드러내지 않고 모듈은 자신이 몰라야 하는 여러 객체를 탐색할 필요가 없다.

따라서 디미터 법칙을 위반하지 않는다.

<br/>

## 자료 전달 객체

---

자료 구조체의 전형적인 형태는 **공개 변수만 있고 함수가 없는 클래스다.**

- 이를 때로는 **자료 전달 객체(DTO : Data Transfer Objtect)**라고 한다.
- 특히 데이터베이스와 통신하거나 소켓에서 받은 메시지의 구문을 분석할 때 유용하다.

```java
public class Address {
  public String street;
  public String streetExtra;
  public String city;
  public String state;
  public String zip;
}
```

<br/>

### 활성 레코드

---

앞선 **DTO의 특수한 형태**다.

- 공개 변수가 있거나 비공개 변수에 `getter`/`setter` 가 있는 자료 구조지만, 대게 `save` 나 `find` 와 같은 탐색 함수도 제공한다.

활성 레코드에 비즈니스 규칙을 추가해 객체로 취급하는 개발자가 흔하지만, 이러면 잡종 구조가 나오기에 바람직하지 않다.

- 그렇기에 활성 레코드를 자료 구조로 취급하고, 비즈니스 규칙을 담으면서 내부 자료를 숨기는 객체는 따로 생성한다.

<br/>

## 결론

---

객체는 동작을 공개하고 자료를 숨긴다.

- 그래서 기본 동작을 변경하지 않으면서 새 객체 타입을 추가하기는 쉬운 반면, 기존 객체에 새 동작을 추가하기는 어렵다.

자료 구조는 별다른 동작 없이 자료를 노출한다.

- 그래서 기존 자료 구조에 새 동작을 추가하기는 쉬우나, 기존 함수에서 새 자료 구조를 추가하기는 어렵다.

> 그렇기에 시스템 구현 시, 새로운 자료 타입을 추가하는 유연성이 필요하다면 객체가 더 적합하고 새로운 동작을 추가하는 유연성이 필요하면 자료 구조와 절차적인 코드가 더 적합하다.
