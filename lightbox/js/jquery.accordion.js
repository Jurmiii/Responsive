/**
 * jQuery Accordion Gallery Plugin
 * 가로 슬라이드 아코디언 - 클릭 시 가로로 열리고 나머지는 옆으로 밀림
 */
(function($) {
    'use strict';
    
    // 기본 설정값
    var defaults = {
        animationSpeed: 500,      // 애니메이션 속도 (ms)
        hoverExpand: false,      // 호버 시 확장 여부
        clickExpand: true,       // 클릭 시 확장 여부
        autoCollapse: true,      // 다른 아이템 클릭 시 자동 축소
        expandedWidth: '60%',   // 확장된 아이템 너비
        collapsedWidth: '80px',  // 축소된 아이템 최소 너비
        onExpand: null,          // 확장 콜백
        onCollapse: null,        // 축소 콜백
        onClose: null            // 닫기 콜백
    };
    
    // 생성자 함수
    function AccordionGallery(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this.$items = this.$element.find('.accordion-item-container');
        this.$accordion = this.$element.find('.accordion');
        this.currentIndex = -1;
        this.isAnimating = false;
        
        this.init();
    }
    
    AccordionGallery.prototype = {
        /**
         * 초기화
         */
        init: function() {
            var self = this;
            
            // 초기 상태 설정 - 모든 아이템을 동일 너비로
            this.$items.css({
                'flex': '1',
                'min-width': this.options.collapsedWidth
            });
            
            // info 영역 숨기기 (초기 상태)
            this.$items.find('.accordion-item-info').css({
                'transform': 'translateY(100%)',
                'opacity': '0'
            });
            
            // 클릭 이벤트 바인딩
            this.$items.on('click', function(e) {
                // 닫기 버튼 클릭 시 이벤트 전파 방지
                if ($(e.target).closest('.close').length) {
                    return;
                }
                self.expand($(this));
            });
            
            // 호버 이벤트 (설정이 활성화된 경우)
            if (this.options.hoverExpand) {
                this.$items.on('mouseenter', function() {
                    self.expand($(this));
                });
                
                this.$items.on('mouseleave', function() {
                    if (!$(this).hasClass('active')) {
                        self.collapse($(this));
                    }
                });
            }
            
            // 닫기 버튼 이벤트
            this.$items.find('.close').on('click', function(e) {
                e.stopPropagation();
                self.closeAll();
            });
            
            // 리사이즈 이벤트
            $(window).on('resize', function() {
                self.handleResize();
            });
            
            this.handleResize();
        },
        
        /**
         * 아이템 확장
         */
        expand: function($item) {
            var self = this;
            var index = this.$items.index($item);
            
            // 애니메이션 중이면 무시
            if (this.isAnimating) return;
            
            // 이미 활성화된 아이템이면 무시
            if ($item.hasClass('active')) return;
            
            this.isAnimating = true;
            
            // 다른 아이템 자동 축소
            if (this.options.autoCollapse) {
                this.$items.not($item).each(function() {
                    self.collapse($(this));
                });
            }
            
            // 확장: flex 변경으로 가로로 열림 (다른 아이템은 자동으로 옆으로 밀림)
            $item.css({
                'flex': '0 0 ' + this.options.expandedWidth
            });
            
            // 이미지 확대 효과
            $item.find('.accordion-item-image img').css({
                'transform': 'scale(1.15)'
            });
            
            // 텍스트 영역 슬라이드 업
            $item.find('.accordion-item-info').css({
                'transform': 'translateY(0)',
                'opacity': '1'
            });
            
            // 닫기 버튼 표시
            $item.find('.accordion-item-info .close').css({
                'opacity': '1',
                'transform': 'scale(1)'
            });
            
            // active 클래스 추가
            $item.addClass('active');
            this.currentIndex = index;
            
            // 애니메이션 완료 후 상태 업데이트
            setTimeout(function() {
                self.isAnimating = false;
                // 콜백 실행
                if (typeof self.options.onExpand === 'function') {
                    self.options.onExpand.call(self, index, $item);
                }
            }, self.options.animationSpeed);
        },
        
        /**
         * 아이템 축소
         */
        collapse: function($item) {
            var self = this;
            
            if (!$item.hasClass('active')) return;
            
            // 축소: flex를 1로 복원 (자연스럽게 옆으로 이동)
            $item.css({
                'flex': '1'
            });
            
            // 이미지 원래 크기로
            $item.find('.accordion-item-image img').css({
                'transform': 'scale(1)'
            });
            
            // 텍스트 영역 숨기기
            $item.find('.accordion-item-info').css({
                'transform': 'translateY(100%)',
                'opacity': '0'
            });
            
            // 닫기 버튼 숨기기
            $item.find('.accordion-item-info .close').css({
                'opacity': '0',
                'transform': 'scale(0.5)'
            });
            
            // active 클래스 제거
            $item.removeClass('active');
            this.currentIndex = -1;
            
            // 콜백 실행
            setTimeout(function() {
                if (typeof self.options.onCollapse === 'function') {
                    self.options.onCollapse.call(self, $item);
                }
            }, this.options.animationSpeed);
        },
        
        /**
         * 모든 아이템 닫기 (기본 상태로 복귀)
         */
        closeAll: function() {
            var self = this;
            
            this.$items.each(function() {
                self.collapse($(this));
            });
            
            // 콜백 실행
            if (typeof this.options.onClose === 'function') {
                this.options.onClose.call(this);
            }
        },
        
        /**
         * 반응형 너비 처리
         */
        handleResize: function() {
            var windowWidth = $(window).width();
            
            if (windowWidth <= 767) {
                // 모바일: 세로 아코디언
                this.options.expandedWidth = '100%';
                this.options.collapsedWidth = '100%';
                this.$accordion.css({
                    'flex-direction': 'column',
                    'height': 'auto'
                });
                this.$items.css({
                    'min-width': '100%',
                    'height': '180px',
                    'margin-bottom': '10px'
                });
            } else {
                // 데스크탑: 가로 슬라이드 아코디언
                this.options.expandedWidth = '60%';
                this.options.collapsedWidth = '80px';
                this.$accordion.css({
                    'flex-direction': 'row',
                    'height': '500px'
                });
                this.$items.css({
                    'min-width': this.options.collapsedWidth,
                    'height': '100%',
                    'margin-bottom': '0',
                    'margin': '0 3px'
                });
                this.$items.first().css('margin-left', '0');
                this.$items.last().css('margin-right', '0');
            }
        },
        
        /**
         * 공개 메서드: 특정 인덱스로 이동
         */
        goTo: function(index) {
            if (index >= 0 && index < this.$items.length) {
                this.expand(this.$items.eq(index));
            }
        },
        
        /**
         * 공개 메서드: 다음 아이템
         */
        next: function() {
            var nextIndex = this.currentIndex + 1;
            if (nextIndex >= this.$items.length) {
                nextIndex = 0;
            }
            this.goTo(nextIndex);
        },
        
        /**
         * 공개 메서드: 이전 아이템
         */
        prev: function() {
            var prevIndex = this.currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = this.$items.length - 1;
            }
            this.goTo(prevIndex);
        },
        
        /**
         * 공개 메서드: 초기화
         */
        destroy: function() {
            this.$items.off('click mouseenter mouseleave');
            this.$items.find('.close').off('click');
            $(window).off('resize');
            this.$items.css({
                'flex': '',
                'min-width': ''
            });
            this.$items.removeClass('active');
        }
    };
    
    // jQuery 플러그인として登録
    $.fn.accordionGallery = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);
        
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('accordionGallery');
            
            // 인스턴스가 없으면 생성
            if (!data) {
                $this.data('accordionGallery', new AccordionGallery(this, options));
            }
            // 메서드 호출
            else if (typeof options === 'string') {
                data[options].apply(data, args);
            }
        });
    };
    
})(jQuery);