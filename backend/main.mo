import Text "mo:base/Text";

import Float "mo:base/Float";
import Result "mo:base/Result";
import Error "mo:base/Error";

actor Calculator {
  public func calculate(operation: Text, a: Float, b: Float) : async Result.Result<Float, Text> {
    switch (operation) {
      case ("+") { #ok(a + b) };
      case ("-") { #ok(a - b) };
      case ("*") { #ok(a * b) };
      case ("/") {
        if (b == 0) {
          #err("Division by zero")
        } else {
          #ok(a / b)
        }
      };
      case (_) { #err("Invalid operation") };
    }
  };
}
