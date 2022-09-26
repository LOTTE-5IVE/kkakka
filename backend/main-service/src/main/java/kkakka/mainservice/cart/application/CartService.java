package kkakka.mainservice.cart.application;

import kkakka.mainservice.cart.domain.Cart;
import kkakka.mainservice.cart.domain.CartItem;
import kkakka.mainservice.cart.domain.repository.CartItemRepository;
import kkakka.mainservice.cart.domain.repository.CartRepository;
import kkakka.mainservice.cart.ui.dto.CartRequestDto;
import kkakka.mainservice.cart.ui.dto.CartResponseDto;
import kkakka.mainservice.member.domain.Member;
import kkakka.mainservice.member.domain.repository.MemberRepository;
import kkakka.mainservice.product.domain.Product;
import kkakka.mainservice.product.domain.repository.ProductRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final MemberRepository memberRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository
            , MemberRepository memberRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional
    public boolean saveCartItem(CartRequestDto cartRequestDto) {

        /* 테스트 데이터 */
        Optional<Member> member = memberRepository.findById(cartRequestDto.getMemberId());

        /* 로그인 상태 체크 */

        /* 장바구니 존재 유무 체크 ex) 장바구니에 담아둔 아이템 있는지 */
        Cart cart = new Cart();
        cart = cartRepository.findByMemberId(cartRequestDto.getMemberId());
        if (cart == null) {
            cartRepository.save(new Cart(member.get())); // 장바구니 없으면 생성
            cart = cartRepository.findByMemberId(cartRequestDto.getMemberId());
        }

        /* 현재 장바구니에 동일한 상품 있는지 체크
        /* 동일 상품 있으면 기존 수량 업데이트
         */
        CartItem item = cartItemRepository. findByMemberIdandProductId(member.get().getId(), cartRequestDto.getProductId()); // Test용 Member
        if (item != null) {
            cartItemRepository.updateCartItemQuantity(cartRequestDto.getQuantity(), item.getId());
            return true;
        }

        /* 장바구니 아이템 추가 */
        Optional<Product> product = productRepository.findById(cartRequestDto.getProductId());
        cartItemRepository.save(new CartItem(cart, product.get(), cartRequestDto.getQuantity()));

        return true;
    }

    /* 멤버 장바구니 목록 조회 */
    public List<CartResponseDto> findAllCartItemByMember(Member member) {

        List<CartItem> cartItemList = cartItemRepository.findAllByMemberId(member.getId());

        List<CartResponseDto> result = new ArrayList<>();
        cartItemList.forEach(c -> {
            result.add(CartResponseDto.from(c));
        });

        return result;
    }

    /* 장바구니 아이템 삭제 */
    @Transactional
    public boolean deleteCartItem(Long cartItemId) {

        cartItemRepository.deleteCartItemById(cartItemId);
        return true;
    }
}
