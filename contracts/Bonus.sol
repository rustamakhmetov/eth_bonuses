pragma solidity ^0.4.11;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

    /**
    * @dev Multiplies two numbers, throws on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    /**
    * @dev Integer division of two numbers, truncating the quotient.
    */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    /**
    * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    /**
    * @dev Adds two numbers, throws on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

library Accrual {
    using SafeMath for uint256;

    function accrual(uint256 a) internal pure returns (uint256) {
        uint256 rate;

        if (a >= 5000 && a < 50000) {
            rate = 300;
        } else if (a >= 50000 && a < 125000) {
            rate = 700;
        } else if ( a >= 125000 && a < 200000) {
            rate = 1000;
        }
        if (rate>0) {
            return a.add(a.mul(rate)/10000);
        } else {
            return a;
        }
    }
}


contract Bonus {
    using Accrual for uint256;

    event Buy(address investor, uint256 amount);

    function () payable {
        Buy(msg.sender, msg.value.accrual());
    }
}
