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
- **출력 인수**는 입력 인수보다 **어렵다.**
  - 대개 함수에서 출력으로 받을 것이라고 생각하지 인수로 값을 받을 것이라고 생각 안 한다.

<br/>

### 많이 쓰는 단항식

---

**인수를 하나로 넘기는 경우**는 대표적인 경우는 다음과 같다.

- 인수에 **질문을 던지는 경우**
  - `boolean fileExists("MyFile")`
- **인수를 변환**해 다른 값을 반환하는 경우
  - `InputStream fileOpen("MyFile")`

함수 이름을 지을 때, 두 가지 경우를 구분해서 짓는다.

이 외엔 **이벤트 함수**의 경우가 있다.

- 이벤트 함수는 **입력 인수만 있고** 해당 입력 인수를 통해 **시스템을 변경**한다.

위 경우들에 해당하지 않으면 단항 함수 사용을 지양한다.

- 예를 들어, **변환 함수**의 경우 출력 인수를 사용하면 혼란을 야기(변환 값이 반환 값이라는 보편적인 사고 때문에)한다.

### 플래그 인수

---

플래그 인수는 **함수가 한 번에 여러 가지를 처리한다고 공표하는 것과 같다**고 생각한다.

- 플래그 인수를 추가한다기 보다는, 두 가지 함수로 분리함이 맞다.
  - `render(boolean isSuite)` 👉 `renderForSuite()` + `renderForSingleTest()`

### 이항 함수

---

인수가 두 개인 함수는 의미가 명확하더라도 하나인 함수보다 **이해하는 시간이 길다.**

- 두 번째 인수를 무시해도 된다는 찰나의 순간이 문제를 일으킨다.

물론 이항 함수가 적절한 경우도 있다.

- 좌표를 표현하는 `Point p = new Point(0, 0)` 코드는 각 **인수 위치의 의미(자연적인 순서)가 있고, 하나의 값을 표현하기 위한 요소들**이다.
- 당연하게 여겨지는 `assertEquals(expected, actual)` 에도 각 인수의 위치를 기억해야 하기에 문제가 있다.

이항 함수가 절대적으로 문제라는 말이 아니라 **불가피한 상황에선 사용해야 하지만 위험을 감수하라**는 말이다.

- 최대한 단항 함수로 바꾸려 애써야 한다.
- 클래스 구성원으로 만드는 방법을 통해서도 가능하다.

### 삼항 함수

---

인수가 세 개인 함수는 무시로 야기되는 문제가 두 배로 늘어난다.

- 예를 들어, `assertEquals(message, expected, actual)` 라는 함수에서 `message` 를 무시해야 한다는 생각을 잠시 멈추고 상기하게 된다.
- 반면, `assertEquals(1.0, expected, .001)` 은 그리 음험하지 않은 함수다.
  - 부동소수점 비교가 상대적이라는 사실은 언제나 주지할 사항이기 때문이다.

### 인수 객체

---

인수가 2-3개 필요하다면 **일부를 독자적인 클래스 변수로 선언할 가능성**을 짚어본다.

다음 두 함수를 살펴보자.

```java
Circle makeCircle(double x, double y, double radius);
Circle makeCircle(Point center, double radius);`
```

- 객체를 생성해 인수를 줄이는 방법이 눈속임이라 여겨질지 모르겠다.
  - 하지만, 위 예제에서 **`x` 와 `y` 를 묶었듯이 변수를 묶어 넘기려면 이름을 붙여야 하므로** 결국 개념을 표현하게 된다.

### 인수 목록

---

때로는 **인수 개수가 가변적인 함수**도 있다. `String.format` 메서드가 좋은 예다.

```java
String.format("%s worked %.2f" hours.", name, hours);
```

위 예제처럼 **가변 인수 전부를 동등하게 본다면** `List` 형 인수 하나로 취급할 수 있다.

- 이런 맥락에선 `String.format` 는 이항 함수이며, 실제로 선언부를 살펴보면 이항 함수라는 사실이 드러난다.

```java
public String format(String format, Object... args)
```

가변 인수를 취하는 모든 함수에 같은 원리가 적용된다.

- 하지만 이를 넘어서는 인수를 사용할 경우에는 문제가 있다.

### 동사와 키워드

---

함수 의도나 인수의 순서를 표현하기 위해선 **좋은 함수 이름**이 필요하다.

다음의 원칙에 따라 작성하면 좋다.

- 단항 함수는 함수와 인수가 **동사/명사 쌍을 이뤄야 한다.**
  - `write(name)`, `writeField(name)`
- **키워드**를 추가해 인수 순서를 표현한다.
  - `assertExpectedEqualsActual(expected, actual)`

<br/>

## 부수 효과를 일으키지 마라

---

**부수 효과**는 함수에서 한 가지를 하겠다고 약속하고선 **남몰래 다른 것도 하기에 거짓말이다.**

- 예상치 못하게 **클래스 변수나 함수로 넘어온 인수, 시스템 전역 변수를 수정**하기도 한다.
- 많은 경우 **시간적인 결합(temporal coupling)이나 순서 종속성(order dependency)을 초래**한다.

```java
public class UserValidator {
	private Cryptographer cryptographer;
	public boolean checkPassword(String userName, String password) {
		User user = UserGateway.findByName(userName);
		if (user != User.NULL) {
			String codedPhrase = user.getPhraseEncodedByPassword();
			String phrase = cryptographer.decrypt(codedPhrase, password);
			if ("Valid Password".equals(phrase)) {
				Session.initialize();
				return true;
			}
		}
		return false;
	}
}
```

위 코드에서 발생하는 부수 효과는 **`Session.initialize()` 호출**이다.

- `checkPassword` 함수는 이름 그대로 암호를 확인하지만, 이름에서는 **세션 초기화**에 대한 내용이 드러나지 않는다.
  - 함수 이름만을 통해 이를 사용하면 기존 세션 정보를 지워버릴 위험에 처한다.

이런 부수 효과가 시간적인 결합을 발생시킨다.

- 즉, `checkPassword` 함수는 **특정 상황에서만 호출이 가능하다.**
- 만약, 시간적인 결합을 원한다면 함수 이름을 변경해야 하지만, 함수의 최소 권한의 원칙을 위배하기에 이 또한 좋지 않다.

### 출력 인수

---

일반적으로 우리는 **인수를 함수 입력으로 해석**한다.

```java
appendFooter(s);
```

위 코드는 다음의 의문을 야기한다.

- 이 함수는 무언가에 `s` 를 바닥글로 첨부할까?
- 아니면 `s` 에 바닥글을 첨부할까?
- 인수 `s` 는 입력일까 출력일까?

이는 함수 선언부를 찾아보면 분명해진다.

```java
public void appendFooter(StringBuffer report)
```

인수 `s` 가 출력 인수라는 사실은 알고 있었지만, 선언부를 찾아보고 나서야 의문이 해결되었다.

- 선언부를 보는 행동은 앞의 주춤과 같은 행위로 여겨진다.

객체 지향 언어로 들어서면서 `this` 덕분에 출력 인수를 사용할 필요가 없어졌기에, 위 코드는 다음과 같이 호출 함이 낫다.

```java
report.appendFooter()
```

<br/>

## 명령과 조회를 분리하라

---

함수는 뭔가를 수행하거나 뭔가에 답하거나 **둘 중에 하나만 해야 하며, 둘 다 하면 안된다.**

```java
public boolean set(String attribute, String value);
```

이 함수는 `attribute` 속성을 찾아 값을 `value` 로 설정한 후 성공 여부에 따라 `boolean` 값을 반환한다. 그래서 다음과 같은 괴상한 코드가 나온다.

```java
if (set("username", "unclebob") ...
```

위 코드만 봐선 `"username"` 이 `"unclebob"` 으로 설정되어 있는지 확인하는 함수인지, `"username"` 을 `"unclebob"` 으로 설정하는 함수인지 구분하지 못한다.

- 함수 개발자는 `set` 을 동사로 의도했지만, `if` 문 내에 있으니 **형용사**로 느껴진다.

그래서 명령과 조회를 분리하여 혼란을 없애야한다.

```java
if (set("username", "unclebob") {
	setAttributeExists("username", "unclebob");
	...
}
```

<br/>

## 오류 코드보다 예외를 사용하라

---

명령 함수에서 오류 코드를 반환하는 방식은 **명령/조회 분리 규칙을 미묘하게 위반**한다.

```java
if (deletePage(page) == E_OK)
```

위 코드를 동사/형용사 혼란을 일으키지 않는 대신 **여러 단계로 중첩되는 코드를 야기한다.**

- 오류 코드를 반환하면 **호출자는 오류 코드를 곧바로 처리해야 한다는 문제**에 부딪힌다.

```java
if (deletePage(page) == E_OK) {
	if (registry.deleteReference(page.name) == E_OK) {
		if (configKeys.deleteKey(page.name.makeKey()) == E_OK) {
			logger.log("page deleted");
		} else {
			logger.log("configKey not deleted");
		}
	} else {
		logger.log("deleteReference from registry failed");
	}
} else {
	logger.log("delete failed"); return E_ERROR;
}
```

반면 오류 코드 대신 예외를 사용하면 오류 처리 코드가 원래 코드에서 분리되므로 코드가 깔끔해진다.

```java
try {
	deletePage(page);
	registry.deleteReference(page.name);
	configKeys.deleteKey(page.name.makeKey());
}
catch (Exception e) {
	logger.log(e.getMessage());
}
```

### Try/Catch 블록 뽑아내기

---

`try/catch` 블록은 **코드 구조에 혼란을 일으키고, 정상 동작과 오류 처리 동작을 뒤섞기에** 추하다.

- 그러므로 `try/catch` 블록을 별도 함수로 뽑아내는 편이 좋다.

```java
public void delete(Page page) {
	try {
		deletePageAndAllReferences(page);
  	} catch (Exception e) {
  		logError(e);
  	}
}

private void deletePageAndAllReferences(Page page) throws Exception {
	deletePage(page);
	registry.deleteReference(page.name);
	configKeys.deleteKey(page.name.makeKey());
}

private void logError(Exception e) {
	logger.log(e.getMessage());
}
```

위에서 `delete` 함수는 모든 오류를 처리하기에 코드를 이해하기 쉽다.

- 실제로 페이지를 제거하는 함수는 `deletePageAndAllReferences` 이며, `deletePageAndAllReferences` 함수는 예외 처리를 하지 않는다.

### 오류 처리도 한 가지 작업이다.

---

함수는 한 가지 작업만 해야 하고 오류 처리도 **한 가지 작업**에 해당한다.

- 함수는 오류만 처리해야 마땅하며, 함수에 키워드 `try` 가 있으면 함수 `try` 문으로 시작해 `catch/finally` 문으로 끝나야 한다는 말이다.
