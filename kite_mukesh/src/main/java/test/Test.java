package test;

import org.joda.time.DateTime;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

public class Test {
    public static void main(String[] args) {
        System.out.println(DateTime.now().getMinuteOfDay());

        DateTime t = new DateTime(1553485440000l);
        System.out.println(t.toString());
        System.out.println(t.getMinuteOfDay());
    }
}
