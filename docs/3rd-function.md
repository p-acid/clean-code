---
sidebar_position: 3
---

# 3장. 함수

<br/>

## 들어가며

---

프로그래밍 초창기에는 시스템을 **루틴과 하위 루틴**으로 나눴다.

> 지금은 **함수**만 살아남았다. 그렇기에, 어떤 프로그램이든 가장 기본적인 단위는 함수다.

- 추상화 수준이 다양하고, 중복 코드가 많으며, 낯설고 모호한 자료 유형과 API가 있는 긴 코드는 이해하기 힘들다.
- 의도가 분명한 코드를 만들기 위해선 어떤 노력을 해야하는가?

<br/>

## 작게 만들어라

---

함수를 만드는 첫째 규칙은 **"작게"**다!

- 오랜 시행착오를 바탕으로 작은 함수가 좋다고 확신했으며, 각 함수는 최대한 명백한 상태로 작아야 한다.

### 블록과 들여쓰기

---

다시 말해, `if` 문 `/else` 문 `/while` 문 등에 들어가는 블록은 한 줄이어야 한다는 의미다.

- 그러면 밖을 감싸는 함수가 작아질 뿐만아니라, 블록 안에서 호출하는 함수 이름을 적절히 짓는다면 코드를 이해하기도 쉬워진다.
  - 즉, **중첩 구조가 나올 정도로 함수가 커지면 안된다**는 말이다.

<br/>

## 한 가지만 해라!

---

> 함수는 한 가지를 해야 한다. 그 한 가지를 잘해야 한다. **그 한 가지만을 해야 한다.**

- 이 말의 문제는 **그 한 가지가 무엇인지 알기가 어렵다**는 것이다.
- 이를 쉽게 이해하고자 하면 **추상화 수준에서 하나의 단계만을 하는 것**을 하나만 한다고 생각할 수 있을 것이다.
- 다른 판단 방법은 단순히 다른 표현이 아니라 **의미 있는 이름으로 다른 함수를 추출할 수 있다면** 그 함수는 여러 작업을 하는 셈이다.

### 함수 내 섹션

---

한 가지 작업만 하는 함수는 **자연스럽게 섹션으로 나누기 어렵다.**

<br/>

## 함수 당 추상화 수준은 하나로!

---

함수가 확실히 한 가지 작업만 하려면 **함수 내 모든 문장의 추상화 수준이 동일해야 한다.**

- 예를 들어 `getHtml()` 은 추상화 수준이 높은 반면, `String pagePathName = PathParser.render(pagepath);` 는 추상화 수준이 중간이고, `.append("\n")` 과 같은 코드는 추상화 수준이 아주 낮다.
- 한 함수 내 추상화 수준을 섞으면 이해하기 어렵고, 한 번 문제가 되기 시작하면 문제를 계속 덧붙이게 된다.

### 위에서 아래로 코드 읽기: 내려가기 규칙

---

코드는 **위에서 아래로 이야기처럼 읽혀야 좋다.**

- 즉, 위에서 아래로 프로그램을 읽으면 함수 추상화 수준이 **한 번에 한 단계씩 낮아진다.**
- 추상화 수준이 하나인 함수를 구현하기란 쉽지 않지만, 매우 중요한 규칙이다.
  - 핵심은 **짧으면서도 하나만 하는 함수**이다.

<br/>

## Switch 문

---

`switch` 문은 작게 만들기 어렵기에, `case` 분기가 단 두 개인 `switch` 문도 길다고 판단되며 단일 블록이나 함수를 사용한다.

- 이를 **다형성**을 이용하여 `switch` 문을 **저차원 클래스에 숨기고** 절대로 반복하지 않을 수 있다.

```java
public Money calculatePay(Employee e) throws InvalidEmployeeType {
	switch (e.type) {
		case COMMISSIONED:
			return calculateCommissionedPay(e);
		case HOURLY:
			return calculateHourlyPay(e);
		case SALARIED:
			return calculateSalariedPay(e);
		default:
			throw new InvalidEmployeeType(e.type);
	}
}
```

해당 함수는 다음의 문제점을 갖는다.

- 첫째, **함수가 길고**, 새 직원을 추가할 때마다 이는 더 길어진다.
- 둘째, **한 가지 작업**만 수행하지 않는다.
- 셋째, 코드를 변경할 이유가 여럿이기에, **SRP(Single Responsibility Principle)를 위반**한다.
- 넷째, 새 직원을 추가할 때마다 코드를 변경하기에, **OCP(Open Closed Principle)를 위반**한다.

그리고 다음의 코드를 보자.

```java
public abstract class Employee {
	public abstract boolean isPayday();
	public abstract Money calculatePay();
	public abstract void deliverPay(Money pay);
}
-----------------
public interface EmployeeFactory {
	public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType;
}
-----------------
public class EmployeeFactoryImpl implements EmployeeFactory {
	public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType {
		switch (r.type) {
			case COMMISSIONED:
				return new CommissionedEmployee(r) ;
			case HOURLY:
				return new HourlyEmployee(r);
			case SALARIED:
				return new SalariedEmploye(r);
			default:
				throw new InvalidEmployeeType(r.type);
		}
	}
}
```

위 코드는 `switch` 문을 추상 팩토리에 꽁꽁 숨겨 아무에게 보여주지 않는다.

- 팩토리는 `switch` 문을 사용해 적절한 **`Employee` 파생 클래스의 인스턴스를 생성**한다.
- `calculatePay`, `isPayday`, `deliverPay` 등과 같은 함수는 `Employee` 인터페이스를 거쳐 호출된다.

<br/>

## 서술적인 이름을 사용하라!

---

함수 이름을 `testableHtml` 에서 `SetupTeardownIncluder.render` 로 변경한 것은 함수가 하는 일을 좀 더 잘 표현한 것이다.

좋은 이름이 주는 가치는 아무리 강조해도 지나치지 않다. 워드가 말했던 원칙을 되새겨보자.

> **"코드를 읽으면서 짐작했던 기능을 각 루틴이 그래도 수행한다면 깨끗한 코드라 불러도 되겠다"**

- 함수가 **작고 단순할수록 서술적인 이름을 고르기도 쉬워진다.**
- 이름이 길어도 좋다. **길고 서술적인 주석보다 길고 서술적인 이름**이 좋다.
- 함수 이름을 정할 때, **여러 단어가 쉽게 읽히는 명명법**을 사용한다.
  - 그런 다음, 여러 단어를 사용해 **함수 기능을 잘 표현하는 이름을 선택**한다.
- 이런 저런 **이름을 넣어 코드를 읽어보고**, 최대한 서술적인 이름을 고르자.
- 서술적인 이름을 사용하면 **설계가 뚜렷해지고 코드 개선이 쉬워진다.**
- 이름을 붙일 땐 **일관성이 있어야 한다.**

<br/>

## 함수 인수

---

함수에서 이상적인 인수 개수는 **0개(무항)다.**

- 인수는 **개념을 이해하기 어렵게 만든다.**
- 코드를 읽는 사람에게는 `includeSetupPageInto(newPageContent)` 보다 `includeSetupPage()` 가 이해하기 더 쉽다.
  - **함수 이름과 인수 사이에 추상화 수준이 다르기 때문**이다.
- **테스트 관점**에서 인수는 더 어렵다.
  - 갖가지 인수 조합으로 함수를 검증하는 테스트 케이스를 상상할 때, 인수가 없다면 간단하다.
