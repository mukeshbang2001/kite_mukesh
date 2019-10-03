package stock;

import com.google.common.collect.Lists;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeoutException;

public class RMQConsumer {
    static Map<String, StockInstrument> stockMap = new HashMap<>();

    public static void main(String[] args) throws IOException, TimeoutException {

        List<String> stocks = Lists.newArrayList(
                "a", "b", "c"
        );

        for (String stock : stocks) {
            StockInstrument stockInstrument = new StockInstrument(stock);
            stockMap.put(stock, stockInstrument);
        }



        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        channel.queueDeclare("trade_ticks", false, false, false, null);
        System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            System.out.println(" [x] Received '" + message + "'");
        };
        channel.basicConsume("trade_ticks", true, deliverCallback, consumerTag -> { });



    }

    void udpateTick(Tick tick){

        String tradingSymbol = tick.instrument_token;
        if(!stockMap.containsKey(tradingSymbol))
            return;

        StockInstrument stockInstrument = stockMap.get(tradingSymbol);
        stockInstrument.processTick(tick);


    }
}
