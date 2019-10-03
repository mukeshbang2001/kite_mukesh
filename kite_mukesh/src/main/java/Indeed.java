import com.google.common.collect.Lists;

import java.io.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Indeed {

    static class Node {
        private int n;
        private List<Integer> children;
        private List<Integer> parents;

        Node(int n){
            this.n = n;
            children = new LinkedList();
            parents = new LinkedList();
        }

        List<Integer> getParents(){
//            parents.add
            return parents;
        }


        List<Integer> getChildren(){
            return children;
        }

    }
    public static void main(String[] args) {
        boolean isWeblabEnabled = false;
        Matcher weblabStringMatcher = Pattern.compile("(.+):(.+)").matcher("MOBB_LAUNCH_150207:T1");
        if (weblabStringMatcher.matches()) {
            System.out.println(weblabStringMatcher.group(1) + " - " + weblabStringMatcher.group(2));
        }
        return ;

    }
}
