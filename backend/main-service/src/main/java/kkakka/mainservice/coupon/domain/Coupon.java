package kkakka.mainservice.coupon.domain;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import kkakka.mainservice.category.domain.Category;
import kkakka.mainservice.member.member.domain.Grade;
import kkakka.mainservice.product.domain.Product;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "Coupon")
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Enumerated(EnumType.STRING)
    private Grade grade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private String name;
    private String detail;

    @Enumerated(EnumType.STRING)
    private PriceRule priceRule;

    private LocalDateTime registeredAt;
    private LocalDateTime startedAt;
    private LocalDateTime expiredAt;
    private Integer percentage;
    private Integer maxDiscount;
    private Integer minOrderPrice;

    public static Coupon create(
        Category category,
        Product product,
        String name,
        String detail,
        PriceRule priceRule,
        LocalDateTime startedAt,
        LocalDateTime expiredAt,
        int percentage,
        int maxDiscount,
        int minOrderPrice
    ) {
        return new Coupon(null, category, null, product, name, detail, priceRule,
            LocalDateTime.now(),
            startedAt, expiredAt, percentage, maxDiscount, minOrderPrice);
    }

    public static Coupon create(
        Grade grade,
        String name,
        String detail,
        PriceRule priceRule,
        LocalDateTime startedAt,
        LocalDateTime expiredAt,
        int percentage,
        int maxDiscount,
        int minOrderPrice
    ) {
        return new Coupon(null, null, grade, null, name, detail, priceRule, LocalDateTime.now(),
            startedAt, expiredAt, percentage, maxDiscount, minOrderPrice);
    }

    public boolean isNotExpired() {
        return this.getStartedAt().isBefore(LocalDateTime.now())
            && this.getExpiredAt().isAfter(LocalDateTime.now());
    }
}