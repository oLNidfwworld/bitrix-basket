<template>
    <div class="order-block">
        <h2 class="style-some-title title-margin">Данные для оплаты</h2>
        <form class="order-block__wrapper">
            <div class="order-block__udata">
                <div class="inpt-box">
                    <div class="inpt-box__name">
                        Заказчик<span class="text-red-required">*</span>
                    </div>
                    <div class="inpt-box__radios">
                        <div class="radio">
                            <input type="radio" name="buyer" value="Физ лицо" id="buyer-phys" /><label
                                for="buyer-phys">Физическое лицо</label>
                        </div>
                        <div class="radio">
                            <input type="radio" name="buyer" value="Юр лицо" id="buyer-jur" /><label
                                for="buyer-jur">Юридическое лицо</label>
                        </div>
                    </div>
                </div>
                <div class="inpt-box">
                    <div class="inpt-box__name">
                        Контактное лицо<span class="text-red-required">*</span>
                    </div>
                    <input class="inpt" type="text" placeholder="Константинопольский Константин Константинович" />
                </div>
                <div class="inpt-box">
                    <div class="inpt-box__name">
                        Наименование компании<span class="text-red-required">*</span>
                    </div>
                    <input class="inpt" type="text" placeholder="Например: «ООО «Рога и копыта»" />
                </div>
                <div class="inpt-box">
                    <div class="inpt-box__name">
                        ИНН<span class="text-red-required">*</span>
                    </div>
                    <input class="inpt" type="text" placeholder="123456789012" />
                </div>
                <div class="inpt-box">
                    <div class="inpt-box__name">
                        ОГРН<span class="text-red-required">*</span>
                    </div>
                    <input class="inpt" type="text" placeholder="1234567890123" />
                </div>
                <div class="inpt-box">
                    <div class="inpt-box__name">
                        Адрес доставки<span class="text-red-required">*</span>
                    </div>
                    <input class="inpt" type="text" placeholder="Например: г. Саратов, Юбилейная ул., д. 22" />
                </div>
                <div class="inpt-box">
                    <div class="inpt-box__name">
                        Телефон<span class="text-red-required">*</span>
                    </div>
                    <input class="inpt" type="text" placeholder="+7 (_ _ _ ) _ _ _ - _ _ - _ _" />
                </div>
                <div class="inpt-box">
                    <div class="inpt-box__name">
                        Эл. почта<span class="text-red-required">*</span>
                    </div>
                    <input class="inpt" type="text" placeholder="Например: info@rombart.ru" />
                </div>
                <div class="inpt-box">
                    <div class="inpt-box__name">
                        Примечание к заказу<span class="text-red-required">*</span>
                    </div>
                    <input class="inpt" type="text"
                        placeholder="Примечания к вашему заказу, например, особые пожелания отделу доставки." />
                </div>
            </div>
            <div class="order-block__final-wrapper">
                <div class="order-block__final">
                    <div class="order-block__final-checkbox checkbox">
                        <input type="checkbox" checked id="pay-pocket" name="pocket" /><label for="pay-pocket">Оплата по
                            счёту для юридических лиц</label>
                    </div>
                    <div class="order-block__payment-notice">
                        <p class="order-block__payment-notice-text">
                            Оплата производится по счету, который выставляет менеджер на
                            основании Ваших реквизитов.
                        </p>
                        <div class="order-block__payment-notice-part">
                            <svg width="20" height="17" viewBox="0 0 20 17" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.52628 0L19.0526 16.5H0L9.52628 0Z" fill="#BDC7D9" />
                            </svg>
                        </div>
                    </div>
                    <p class="order-block__terms-notice">
                        Нажимая на кнопку я принимаю
                        <a class="inline-link" href="link/to/terms">правила и условия </a> и
                        согласен с ними
                    </p>
                    <button class="dark btn w-fit order-block__submit" type="submit">
                        Подтвердить заказ
                    </button>
                </div>
            </div>
        </form>
    </div>

</template>