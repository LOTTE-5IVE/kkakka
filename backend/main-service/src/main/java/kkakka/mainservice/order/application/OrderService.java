package kkakka.mainservice.order.application;

import kkakka.mainservice.member.domain.Member;
import kkakka.mainservice.member.domain.repository.MemberRepository;
import kkakka.mainservice.order.domain.Order;
import kkakka.mainservice.order.domain.ProductOrder;
import kkakka.mainservice.order.domain.repository.OrderRepository;
import kkakka.mainservice.product.domain.Product;
import kkakka.mainservice.product.domain.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {

    private final MemberRepository memberRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(MemberRepository memberRepository, OrderRepository orderRepository, ProductRepository productRepository) {
        this.memberRepository = memberRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    /**
     * 주문
     */
    @Transactional
    public Long order(Long memberId, List<Long> productIds, int count) {

        //엔티티 조회
        Member member = memberRepository.findById(memberId).get();

        //상품주문 생성
        List<ProductOrder> productOrders = new ArrayList<>();
        int totalPrice = 0;
        for (Long productId : productIds) {
            Product product = productRepository.findById(productId).get();
            ProductOrder productOrder = ProductOrder.createProductOrder(product, product.getPrice(), count);
            productOrders.add(productOrder);

            totalPrice += productOrder.getPrice() * productOrder.getCount();
        }

        //주문 생성
        Order order = Order.createOrder(member, totalPrice, productOrders);

        //주문 저장
        orderRepository.save(order);

        return order.getId();
    }

}
