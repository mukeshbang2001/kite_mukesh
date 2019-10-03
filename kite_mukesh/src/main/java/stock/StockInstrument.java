package stock;

import java.util.LinkedList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;


public class StockInstrument {
    String stockName;
    List<CandleStick> data_30Sec = new LinkedList<>();
    List<CandleStick> data_1Min = new LinkedList<>();
    List<CandleStick> data_3Min = new LinkedList<>();
    List<Tick> ticks;

    double open;
    double close;
    double high;
    double low;

    public StockInstrument(String stockName) {
        this.stockName = stockName;
    }

    private void init(){
        // create 3 timers

        Timer timer = new Timer();
        TimerTask task1 = new TimerTask() {
            @Override
            public void run() {
                CandleStick newCandle = new CandleStick();
                data_30Sec.add(newCandle);

            }
        };
        TimerTask task2 = new TimerTask() {
            @Override
            public void run() {
                CandleStick newCandle = new CandleStick();
                data_1Min.add(newCandle);

            }
        };

        TimerTask task3 = new TimerTask() {
            @Override
            public void run() {
                CandleStick newCandle = new CandleStick();
                data_3Min.add(newCandle);

            }
        };

        timer.scheduleAtFixedRate(task1, 0, 30*1000);
        timer.scheduleAtFixedRate(task2, 0, 60*1000);
        timer.scheduleAtFixedRate(task3, 0, 3*60*1000);


    }


    void processTick(Tick tick){
        ticks.add(tick);
        open = tick.ohlc.open;
        high = tick.ohlc.high;
        low = tick.ohlc.low;
        close = tick.ohlc.close;


        CandleStick candle1 = data_30Sec.get(data_30Sec.size() - 1);
        CandleStick prev_candle1 = data_30Sec.get(data_30Sec.size() > 1 ? data_30Sec.size() - 2: 0);

        CandleStick candle2 = data_1Min.get(data_1Min.size() - 1);
        CandleStick prev_candle2 = data_1Min.get(data_1Min.size() > 1 ? data_1Min.size() - 2: 0);

        CandleStick candle3 = data_3Min.get(data_3Min.size() - 1);
        CandleStick prev_candle3 = data_3Min.get(data_3Min.size() > 1 ? data_3Min.size() - 2: 0);

        updateCandle(candle1, tick.last_price, tick.volume - prev_candle1.volume);
        updateCandle(candle2, tick.last_price, tick.volume - prev_candle2.volume);
        updateCandle(candle3, tick.last_price, tick.volume - prev_candle3.volume);

    }

    private void updateCandle(CandleStick candle, double lastPrice, double volume) {
        if (candle.ohlc.open == 0)
            candle.ohlc.open = lastPrice;
        if (candle.ohlc.high == 0 || lastPrice > candle.ohlc.high)
            candle.ohlc.high = lastPrice;
        if (candle.ohlc.low == 0 || lastPrice < candle.ohlc.low)
            candle.ohlc.low = lastPrice;
        candle.ohlc.close = lastPrice;
        candle.volume = volume;

    }
}


