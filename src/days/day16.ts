import { Day } from "../day";
import { sumValuesInArray } from "../utils/array-utils";

interface PacketInfo {
  value: number;
  nextIndex: number;
}

export class Day16 extends Day {
  private _binaryValue: string;

  private _literalValueFunction: (
    packetVersion: number,
    literalResult: number
  ) => number;
  private _operatorValueFunction: (
    packetVersion: number,
    operatorResult: number
  ) => number;
  private _operatorEvaluationFunction: (
    packetTypeId: number,
    subpacketResults: number[]
  ) => number;

  public solvePartOne(input: string): number {
    this._binaryValue = this._convertHexToBinaryString(input);

    this._literalValueFunction = (
      packetVersion: number,
      literalResult: number
    ) => packetVersion;
    this._operatorValueFunction = (
      packetVersion: number,
      operatorResult: number
    ) => packetVersion + operatorResult;
    this._operatorEvaluationFunction = (
      packetTypeId: number,
      subpacketResults: number[]
    ) => sumValuesInArray(subpacketResults);

    return this._decodePacket(0).value;
  }

  public solvePartTwo(input: string): number {
    this._binaryValue = this._convertHexToBinaryString(input);

    this._literalValueFunction = (
      packetVersion: number,
      literalResult: number
    ) => literalResult;
    this._operatorValueFunction = (
      packetVersion: number,
      operatorResult: number
    ) => operatorResult;
    this._operatorEvaluationFunction = this._evaluateOperator;

    return this._decodePacket(0).value;
  }

  private _decodePacket(startIndex: number): PacketInfo {
    const packetVersion: number = this._convertBinaryToDecString(
      this._binaryValue.substring(startIndex, startIndex + 3)
    );
    const packetTypeId: number = this._convertBinaryToDecString(
      this._binaryValue.substring(startIndex + 3, startIndex + 6)
    );

    switch (packetTypeId) {
      case 4:
        const literalPacketResult: PacketInfo = this._decodeLiteralPacket(
          startIndex + 6
        );
        return {
          value: this._literalValueFunction(
            packetVersion,
            literalPacketResult.value
          ),
          nextIndex: literalPacketResult.nextIndex,
        };
      default:
        const operatorPacketResult: PacketInfo = this._decodeOperatorPacket(
          startIndex + 6,
          packetTypeId
        );
        return {
          value: this._operatorValueFunction(
            packetVersion,
            operatorPacketResult.value
          ),
          nextIndex: operatorPacketResult.nextIndex,
        };
    }
  }

  private _decodeLiteralPacket(dataStartIndex: number): PacketInfo {
    let index: number = dataStartIndex;
    let packetBinaryValue: string = "";
    while (true) {
      packetBinaryValue += this._binaryValue.substring(index + 1, index + 5);
      if (this._binaryValue.at(index) == "0") {
        index += 5;
        break;
      }
      index += 5;
    }
    return {
      value: this._convertBinaryToDecString(packetBinaryValue),
      nextIndex: index,
    };
  }

  private _decodeOperatorPacket(
    dataStartIndex: number,
    packetTypeId: number
  ): PacketInfo {
    const lengthTypeId: number = this._convertBinaryToDecString(
      this._binaryValue.at(dataStartIndex)
    );

    let expectedSubpacketEndIndex: number = Number.MAX_VALUE;
    let expectedSubpacketCount: number = Number.MAX_VALUE;
    let index: number = dataStartIndex + 1;
    if (lengthTypeId == 0) {
      const subpacketBitLength: number = this._convertBinaryToDecString(
        this._binaryValue.substring(index, index + 15)
      );
      index += 15;
      expectedSubpacketEndIndex = index + subpacketBitLength;
    } else {
      expectedSubpacketCount = this._convertBinaryToDecString(
        this._binaryValue.substring(index, index + 11)
      );
      index += 11;
    }

    const subpacketValues: number[] = [];
    while (
      subpacketValues.length < expectedSubpacketCount &&
      index < expectedSubpacketEndIndex
    ) {
      const subpacketResult: PacketInfo = this._decodePacket(index);
      index = subpacketResult.nextIndex;
      subpacketValues.push(subpacketResult.value);
    }
    return {
      value: this._operatorEvaluationFunction(packetTypeId, subpacketValues),
      nextIndex: index,
    };
  }

  private _evaluateOperator(
    packetTypeId: number,
    subpacketResults: number[]
  ): number {
    switch (packetTypeId) {
      case 0:
        return sumValuesInArray(subpacketResults);
      case 1:
        return subpacketResults.reduce((product, curr) => product * curr, 1);
      case 2:
        return Math.min(...subpacketResults);
      case 3:
        return Math.max(...subpacketResults);
      case 5:
        return subpacketResults[0] > subpacketResults[1] ? 1 : 0;
      case 6:
        return subpacketResults[0] < subpacketResults[1] ? 1 : 0;
      case 7:
        return subpacketResults[0] == subpacketResults[1] ? 1 : 0;
    }
  }

  /**
   * Maps a hexadecimal number to a binary string left padded so each hex character contributes 4 bits.
   * Note cannot do this directly as numbers are not stored to enough precision.
   */
  private _convertHexToBinaryString(hex: string): string {
    return [...hex]
      .flatMap((hexChar) => [
        ...parseInt(hexChar, 16).toString(2).padStart(4, "0"),
      ])
      .join("");
  }

  private _convertBinaryToDecString(bin: string): number {
    return parseInt(bin, 2);
  }
}
